import { Navigate } from 'react-router-dom'
import { Users, BarChart3, Send, ShieldCheck, Megaphone } from 'lucide-react'
import Button from '../../../shared/components/Button'
import InputField from '../../../shared/components/InputField'
import Skeleton from '../../../shared/components/Skeleton'
import useAdmin from '../hooks/useAdmin'

const TAB_ICONS = {
  beta: Users,
  stats: BarChart3,
  broadcast: Megaphone,
  promote: ShieldCheck,
}

function TabButton({ active, label, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plumbob ${
        active
          ? 'bg-plumbob text-white shadow-lg shadow-plumbob/20'
          : 'text-text-sub hover:text-text-main hover:bg-hover'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  )
}

function Feedback({ feedback }) {
  if (!feedback) return null
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        feedback.type === 'success'
          ? 'border-plumbob/30 bg-plumbob/10 text-plumbob'
          : 'border-red-500/30 bg-red-500/10 text-red-400'
      }`}
    >
      {feedback.message}
    </div>
  )
}

function StatsTab({ content, stats, loading, error }) {
  if (loading) {
    return <Skeleton className="h-24 w-full" />
  }
  if (error) {
    return <p className="text-sm text-red-400">{error}</p>
  }
  if (!stats.length) {
    return <p className="text-sm text-text-sub">{content.empty_stats}</p>
  }

  const sorted = [...stats].sort((a, b) => b.purchaseCount - a.purchaseCount)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/60 text-xs uppercase tracking-wide text-text-sub">
            <th className="py-2 pr-4">{content.table_extension}</th>
            <th className="py-2 pr-4">{content.table_count}</th>
            <th className="py-2 pr-4">{content.table_status}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {sorted.map((s) => (
            <tr key={s.extensionId}>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span className="font-medium text-text-main">{s.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4 font-semibold text-text-main">
                {s.purchaseCount}
              </td>
              <td className="py-3 pr-4">
                <span className="inline-flex items-center rounded-full bg-surface border border-border px-2.5 py-0.5 text-xs font-semibold">
                  {s.isPublic ? content.table_public : content.table_private}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BetaUsersTab({ content, users, loading, error }) {
  if (loading) {
    return <Skeleton className="h-24 w-full" />
  }
  if (error) {
    return <p className="text-sm text-red-400">{error}</p>
  }
  if (!users.length) {
    return <p className="text-sm text-text-sub">{content.empty_beta}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/60 text-xs uppercase tracking-wide text-text-sub">
            <th className="py-2 pr-4">{content.table_name}</th>
            <th className="py-2 pr-4">{content.table_email}</th>
            <th className="py-2 pr-4">{content.table_country}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {users.map((u) => (
            <tr key={u.email}>
              <td className="py-3 pr-4 font-medium text-text-main">
                {u.fullName || u.email}
              </td>
              <td className="py-3 pr-4 text-text-sub">{u.email}</td>
              <td className="py-3 pr-4 text-text-sub">{u.country || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BroadcastTab({ content, subject, setSubject, body, setBody, broadcasting, feedback, onSend }) {
  return (
    <form noValidate onSubmit={onSend} className="space-y-5">
      <InputField
        label={content.broadcast_subject_label}
        name="subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="broadcast-body" className="text-sm font-medium text-text-muted">
          {content.broadcast_body_label}
        </label>
        <textarea
          id="broadcast-body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          className="rounded-xl border px-4 py-2.5 text-sm text-text-primary placeholder:text-text-dim bg-slate-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-plumbob/40 focus:border-plumbob border-slate-border hover:border-text-dim"
        />
      </div>
      <Feedback feedback={feedback} />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={broadcasting}>
          <Send className="h-4 w-4" />
          {content.broadcast_send}
        </Button>
      </div>
    </form>
  )
}

function PromoteTab({ content, email, setEmail, promoting, feedback, onPromote }) {
  return (
    <form noValidate onSubmit={onPromote} className="space-y-5">
      <InputField
        label={content.table_email}
        name="promoteEmail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={content.promote_search_placeholder}
        required
      />
      <Feedback feedback={feedback} />
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" loading={promoting}>
          <ShieldCheck className="h-4 w-4" />
          {content.promote_button}
        </Button>
      </div>
    </form>
  )
}

function AdminPage() {
  const {
    isLoggedIn,
    isAdmin,
    content,
    tab,
    setTab,
    betaUsers,
    stats,
    loadingBeta,
    loadingStats,
    betaError,
    statsError,
    subject,
    setSubject,
    body,
    setBody,
    broadcasting,
    broadcastFeedback,
    handleBroadcast,
    promoteEmail,
    setPromoteEmail,
    promoting,
    promoteFeedback,
    handlePromote,
  } = useAdmin()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8 text-center">
          <p className="text-sm text-text-sub">{content.no_perms}</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'beta', label: content.beta_users_tab, icon: TAB_ICONS.beta },
    { key: 'stats', label: content.stats_tab, icon: TAB_ICONS.stats },
    { key: 'broadcast', label: content.broadcast_tab, icon: TAB_ICONS.broadcast },
    { key: 'promote', label: content.promote_tab, icon: TAB_ICONS.promote },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
        <div className="flex items-center gap-3 border-b border-border/60 pb-6 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-plumbob/15 border border-plumbob/30">
            <ShieldCheck className="h-6 w-6 text-plumbob" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-main md:text-2xl">
              {content.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <TabButton
              key={t.key}
              active={tab === t.key}
              label={t.label}
              icon={t.icon}
              onClick={() => setTab(t.key)}
            />
          ))}
        </div>

        {tab === 'beta' && (
          <BetaUsersTab
            content={content}
            users={betaUsers}
            loading={loadingBeta}
            error={betaError}
          />
        )}
        {tab === 'stats' && (
          <StatsTab
            content={content}
            stats={stats}
            loading={loadingStats}
            error={statsError}
          />
        )}
        {tab === 'broadcast' && (
          <BroadcastTab
            content={content}
            subject={subject}
            setSubject={setSubject}
            body={body}
            setBody={setBody}
            broadcasting={broadcasting}
            feedback={broadcastFeedback}
            onSend={handleBroadcast}
          />
        )}
        {tab === 'promote' && (
          <PromoteTab
            content={content}
            email={promoteEmail}
            setEmail={setPromoteEmail}
            promoting={promoting}
            feedback={promoteFeedback}
            onPromote={handlePromote}
          />
        )}
      </div>
    </div>
  )
}

export default AdminPage
import useContent from "../../../shared/hooks/useContent";

function AboutPage() {
  const { content } = useContent("about.page");

  return (
    <section className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-extrabold text-text-main md:text-4xl tracking-tight">
          {content.title}
        </h1>
        <div className="h-1 w-20 mx-auto rounded-full bg-plumbob/60" />
        <p className="text-text-sub text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          {content.description}
        </p>
      </div>
    </section>
  );
}

export default AboutPage;

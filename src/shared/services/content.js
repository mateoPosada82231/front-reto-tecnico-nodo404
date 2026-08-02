import { get, post, put, del } from './httpClient'

const BASE_URL = '/api/content'
const CONFIG_URL = '/api/config'

export function getContentBySection(sectionKey, language = 'es') {
  return get(`${BASE_URL}/${sectionKey}?language=${language}`)
}

export function getContentByKey(sectionKey, contentKey, language = 'es') {
  return get(`${BASE_URL}/${sectionKey}/${contentKey}?language=${language}`)
}

export function getConfig(configKey) {
  return get(`${CONFIG_URL}/${configKey}`)
}

export function createContent(data) {
  return post(BASE_URL, data)
}

export function updateContent(id, data) {
  return put(`${BASE_URL}/${id}`, data)
}

export function deleteContent(id) {
  return del(`${BASE_URL}/${id}`)
}

export function createConfig(data) {
  return post(CONFIG_URL, data)
}

export function updateConfig(id, data) {
  return put(`${CONFIG_URL}/${id}`, data)
}

export function deleteConfig(id) {
  return del(`${CONFIG_URL}/${id}`)
}

export function canWriteItems(user, localMode = false) {
  return Boolean(user) || localMode
}

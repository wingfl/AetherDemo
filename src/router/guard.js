export const beforeEach = (to, from, next) => {
  console.log('路由前置守卫:', 'from:', from.path, 'to:', to.path)
  
  next()
}

export const afterEach = (to, from) => {
  console.log('路由后置守卫:', 'from:', from.path, 'to:', to.path)
}
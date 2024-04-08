import config from '../config'

import Home from '../pages/Home'
import Signin from '../pages/Signin'
import Signup from '../pages/Signup'

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.signin, component: Signin },
    { path: config.routes.signup, component: Signup },
]

const privateRoutes = []

export { publicRoutes, privateRoutes }

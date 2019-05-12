
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { name: 'Search', path: '', component: () => import('pages/Index.vue') },
      { name: 'Title', path: 'title/:title', component: () => import('pages/Title.vue') },
      { name: 'Favorites', path: 'favorites', component: () => import('pages/Favorites.vue') },
      { name: 'About', path: 'about', component: () => import('pages/About.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;

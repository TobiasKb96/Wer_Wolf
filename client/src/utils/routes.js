import React from 'react';

const pages = import.meta.glob('../pages/**/*.jsx');

const routes = Object.keys(pages).map((path) => {
    // Extract the page name and create a route
    const name = path.match(/\/pages\/(.*?)\/(.*?)\.jsx/)[1]; // Extract folder name
    const routePath = name === 'Home' ? '/' : `/${name.toLowerCase()}`;
    return {
        path: routePath === '/join' ? '/join/:sessionId' : routePath, // Handle dynamic route
        name: name.charAt(0).toUpperCase() + name.slice(1),
        component: React.lazy(pages[path]),
    };
});

export default routes;

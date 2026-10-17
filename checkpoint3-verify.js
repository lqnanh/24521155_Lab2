import { DataFeed } from './data-feed.js';
import { setRenderer, renderApp } from './reactive-engine.js';

const root = document.getElementById('app');

setRenderer(() => renderApp(DataFeed, root)); 
renderApp(DataFeed, root);                    
import React from 'react';
import { Route } from 'react-router';
import Schedule from './components/schedule';
import App from './components/app';
import Announcement from './components/announcements';
import Companies from './components/companies';
import Chat from './components/chat';
import Help from './components/help';

export default(
  <Route path="/" component={App}>
    <Route path="/schedule" component={Schedule} />
    <Route path="/announcement" component={Announcement} />
    <Route path="/companies" component={Companies} />
    <Route path="/chat" component={Chat} />
    <Route path="/help" component={Help} />
  </Route>
);

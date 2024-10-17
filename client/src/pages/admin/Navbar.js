import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Pour la navigation avec React Router
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

export default function NavTabs() {
  const navigate = useNavigate();  // Utilisation pour la navigation
  const location = useLocation();  // Utilisé pour vérifier le chemin actuel

  const tabs = [
    { label: 'Customers', href: '/admin' },
    { label: 'Categories', href: '/admin/categories' },
    { label: 'Items', href: '/admin/items' },
    { label: 'Prices', href: '/admin/prices' },
    { label: 'Deposits', href: '/admin/deposits' },
    { label: 'Purchases', href: '/admin/purchases' },
  ];

  // Trouver l'onglet correspondant à l'URL actuelle
  const currentTab = tabs.findIndex((tab) => location.pathname === tab.href);
  const [value, setValue] = React.useState(currentTab !== -1 ? currentTab : 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(tabs[newValue].href);  // Naviguer vers la route correspondante
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="nav tabs example"
        role="navigation"
      >
        {tabs.map((tab, index) => (
          <LinkTab
            key={index}
            label={tab.label}
            href={tab.href}
          />
        ))}
      </Tabs>
    </Box>
  );
}

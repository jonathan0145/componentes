import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { FaHome, FaComments, FaBuilding, FaUser, FaChartBar } from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);

  const getNavigationItems = () => {
    const commonItems = [
      { to: '/dashboard', icon: FaHome, label: 'Dashboard' },
      { to: '/chat', icon: FaComments, label: 'Chat' },
      { to: '/properties', icon: FaBuilding, label: 'Propiedades' },
      { to: '/profile', icon: FaUser, label: 'Perfil' },
    ];

    // Agregar elementos específicos por rol
    if (user?.role === 'agent') {
      commonItems.splice(3, 0, {
        to: '/analytics',
        icon: FaChartBar,
        label: 'Analytics'
      });
    }

    return commonItems;
  };

  return (
    <div className="bg-light border-end vh-100 pt-3" style={{ width: '250px' }}>
      <Nav className="flex-column">
        {getNavigationItems().map((item) => (
          <LinkContainer to={item.to} key={item.to}>
            <Nav.Link className="py-2 px-3 text-dark">
              <item.icon className="me-2" />
              {item.label}
            </Nav.Link>
          </LinkContainer>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
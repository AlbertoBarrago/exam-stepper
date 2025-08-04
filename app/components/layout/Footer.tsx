import React from 'react';
import packageJson from '../../../package.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-4 text-center text-sm text-gray-500">
      alBz ©{currentYear} v{packageJson.version}
    </footer>
  );
};

export default Footer;

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="py-4 text-center text-sm text-gray-500">alBz ©{currentYear}</footer>;
};

export default Footer;

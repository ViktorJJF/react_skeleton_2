import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t mt-auto py-4">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Acme Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

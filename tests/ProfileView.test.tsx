import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileView from '../src/views/ProfileView';

// Mock the toast hook
jest.mock('../src/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock the ViewComponent
jest.mock('../src/components/layout/TheView', () => {
  return function MockViewComponent({ children, title }: any) {
    return (
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    );
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProfileView', () => {
  it('renders profile management interface', () => {
    renderWithRouter(<ProfileView />);
    
    // Check if the main title is rendered
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    
    // Check if tab navigation is present
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('displays user information', () => {
    renderWithRouter(<ProfileView />);
    
    // Check if user name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check if role is displayed
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  it('shows edit profile button', () => {
    renderWithRouter(<ProfileView />);
    
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });
}); 
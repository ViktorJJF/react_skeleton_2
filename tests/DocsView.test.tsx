import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DocsView from '../src/views/DocsView';

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

describe('DocsView', () => {
  it('renders documentation interface', () => {
    renderWithRouter(<DocsView />);
    
    // Check if the main title is rendered
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    
    // Check if search functionality is present
    expect(screen.getByPlaceholderText('Search docs...')).toBeInTheDocument();
    
    // Check if main sections are displayed
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Chatbots')).toBeInTheDocument();
    expect(screen.getByText('API Reference')).toBeInTheDocument();
  });

  it('displays getting started section by default', () => {
    renderWithRouter(<DocsView />);
    
    // Check if getting started content is displayed
    expect(screen.getByText('Quick start guide and basic setup')).toBeInTheDocument();
    expect(screen.getByText('Introduction to MatDash')).toBeInTheDocument();
    expect(screen.getByText('Quick Start Guide')).toBeInTheDocument();
  });

  it('shows difficulty badges', () => {
    renderWithRouter(<DocsView />);
    
    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('displays popular articles section', () => {
    renderWithRouter(<DocsView />);
    
    expect(screen.getByText('Popular Articles')).toBeInTheDocument();
    expect(screen.getByText('Creating Your First Chatbot')).toBeInTheDocument();
  });
}); 
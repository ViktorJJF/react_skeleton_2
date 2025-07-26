import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PricingView from '../src/views/PricingView';

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

describe('PricingView', () => {
  it('renders pricing interface', () => {
    renderWithRouter(<PricingView />);
    
    // Check if the main title is rendered
    expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
    
    // Check if pricing plans are displayed
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('displays pricing information', () => {
    renderWithRouter(<PricingView />);
    
    // Check if prices are displayed
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
  });

  it('shows billing toggle', () => {
    renderWithRouter(<PricingView />);
    
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();
  });

  it('displays popular plan badge', () => {
    renderWithRouter(<PricingView />);
    
    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('shows feature comparison section', () => {
    renderWithRouter(<PricingView />);
    
    expect(screen.getByText('Everything you need to succeed')).toBeInTheDocument();
    expect(screen.getByText('Core Features')).toBeInTheDocument();
    expect(screen.getByText('Advanced Features')).toBeInTheDocument();
  });

  it('displays FAQ section', () => {
    renderWithRouter(<PricingView />);
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('Can I change plans anytime?')).toBeInTheDocument();
  });

  it('shows call-to-action section', () => {
    renderWithRouter(<PricingView />);
    
    expect(screen.getByText('Ready to get started?')).toBeInTheDocument();
    expect(screen.getByText('Start Free Trial')).toBeInTheDocument();
  });
}); 
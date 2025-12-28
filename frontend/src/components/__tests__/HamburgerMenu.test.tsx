import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { HamburgerMenu } from '../HamburgerMenu';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('HamburgerMenu', () => {
  it('renders hamburger button', () => {
    renderWithRouter(<HamburgerMenu />);
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    expect(hamburgerButton).toBeInTheDocument();
  });

  it('opens menu when hamburger is clicked', () => {
    renderWithRouter(<HamburgerMenu />);
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    
    fireEvent.click(hamburgerButton);
    
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });

  it('closes menu when close button is clicked', () => {
    renderWithRouter(<HamburgerMenu />);
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    
    // Open menu
    fireEvent.click(hamburgerButton);
    expect(screen.getByText('Menu')).toBeInTheDocument();
    
    // Close menu
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MenuProvider, useMenu } from '../../context/MenuContext';
import { Layout } from '../Layout';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MenuProvider>
        {component}
      </MenuProvider>
    </BrowserRouter>
  );
};

describe('Layout', () => {
  it('renders children when menu is open', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    // Content should not be visible by default (menu closed)
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('shows sidebar and content when menu is open', () => {
    const TestComponent = () => {
      const { isMenuOpen, toggleMenu } = useMenu();
      
      return (
        <div>
          <button onClick={toggleMenu}>Toggle Menu</button>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </div>
      );
    };

    renderWithProviders(<TestComponent />);
    
    const toggleButton = screen.getByText('Toggle Menu');
    fireEvent.click(toggleButton);
    
    // After clicking toggle, content should be visible
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });
});

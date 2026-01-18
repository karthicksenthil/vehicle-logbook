import { render, screen, fireEvent } from '@testing-library/react';
import { QuickSelectButtons } from '../../src/components/quickSelectButton';

describe('QuickSelectButtons', () => {
  it('should render quick select buttons', () => {
    const onQuickSelect = jest.fn();
    const vehicles = [
      { make: 'Tesla', model: 'Model 3', badge: 'Performance', label: 'Tesla Model 3 Performance' },
      { make: 'Ford', model: 'Ranger', badge: 'Wildtrak', label: 'Ford Ranger Wildtrak' }
    ];
    render(<QuickSelectButtons vehicles={vehicles} onQuickSelect={onQuickSelect} />);

    expect(screen.getByText('Quick Select:')).toBeInTheDocument();
    expect(screen.getByText('Tesla Model 3 Performance')).toBeInTheDocument();
    expect(screen.getByText('Ford Ranger Wildtrak')).toBeInTheDocument();
  });

  it('should call onQuickSelect when button is clicked', () => {
    const onQuickSelect = jest.fn();
    const vehicles = [
      { make: 'Tesla', model: 'Model 3', badge: 'Performance', label: 'Tesla Model 3 Performance' },
      { make: 'Ford', model: 'Ranger', badge: 'Wildtrak', label: 'Ford Ranger Wildtrak' }
    ];
    render(<QuickSelectButtons vehicles={vehicles} onQuickSelect={onQuickSelect} />);

    const teslaButton = screen.getByText('Tesla Model 3 Performance');
    fireEvent.click(teslaButton);

    expect(onQuickSelect).toHaveBeenCalledWith({
      make: 'Tesla',
      model: 'Model 3',
      badge: 'Performance',
      label: 'Tesla Model 3 Performance'
    });
  });

  it('should handle multiple quick select clicks', () => {
    const onQuickSelect = jest.fn();
    const vehicles = [
      { make: 'Tesla', model: 'Model 3', badge: 'Performance', label: 'Tesla Model 3 Performance' },
      { make: 'Ford', model: 'Ranger', badge: 'Wildtrak', label: 'Ford Ranger Wildtrak' }
    ];
    render(<QuickSelectButtons vehicles={vehicles} onQuickSelect={onQuickSelect} />);

    fireEvent.click(screen.getByText('Tesla Model 3 Performance'));
    fireEvent.click(screen.getByText('Ford Ranger Wildtrak'));

    expect(onQuickSelect).toHaveBeenCalledTimes(2);
  });
});
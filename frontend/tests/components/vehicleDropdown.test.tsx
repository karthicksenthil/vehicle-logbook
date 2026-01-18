import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleDropdowns } from '../../src/components/vehicleDropdown';

describe('VehicleDropdowns', () => {
  const defaultProps = {
    make: '',
    model: '',
    badge: '',
    makes: ['Ford', 'Tesla', 'BMW'],
    models: [],
    badges: [],
    onMakeChange: jest.fn(),
    onModelChange: jest.fn(),
    onBadgeChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all three dropdowns with correct options', () => {
    const props = {
      ...defaultProps,
      make: 'Tesla',
      model: 'Model 3',
      models: ['Model 3', 'Model S', 'Model X'],
      badges: ['Standard', 'Performance', 'Long Range']
    };

    render(<VehicleDropdowns {...props} />);

    // Verify all dropdowns are rendered
    const makeSelect = screen.getByLabelText(/Make \*/i);
    const modelSelect = screen.getByLabelText(/Model \*/i);
    const badgeSelect = screen.getByLabelText(/Badge \*/i);

    // Verify make options
    const makeOptions = within(makeSelect).getAllByRole('option');
    expect(makeOptions).toHaveLength(4); // placeholder + 3 makes
    expect(makeOptions[1]).toHaveTextContent('Ford');
    expect(makeOptions[2]).toHaveTextContent('Tesla');
    expect(makeOptions[3]).toHaveTextContent('BMW');

    // Verify model options
    const modelOptions = within(modelSelect).getAllByRole('option');
    expect(modelOptions).toHaveLength(4); // placeholder + 3 models
    expect(modelOptions[1]).toHaveTextContent('Model 3');
    expect(modelOptions[2]).toHaveTextContent('Model S');

    // Verify badge options
    const badgeOptions = within(badgeSelect).getAllByRole('option');
    expect(badgeOptions).toHaveLength(4); // placeholder + 3 badges
    expect(badgeOptions[1]).toHaveTextContent('Standard');
    expect(badgeOptions[2]).toHaveTextContent('Performance');
  });

  it('should handle cascading disabled states correctly', () => {
    const { rerender } = render(<VehicleDropdowns {...defaultProps} />);

    // Initially: model and badge should be disabled
    expect(screen.getByLabelText(/Make \*/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/Model \*/i)).toBeDisabled();
    expect(screen.getByLabelText(/Badge \*/i)).toBeDisabled();

    // After make selection: model should be enabled, badge still disabled
    const propsWithMake = {
      ...defaultProps,
      make: 'Tesla',
      models: ['Model 3', 'Model S']
    };
    rerender(<VehicleDropdowns {...propsWithMake} />);

    expect(screen.getByLabelText(/Make \*/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/Model \*/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/Badge \*/i)).toBeDisabled();

    // After model selection: all should be enabled
    const propsWithModel = {
      ...propsWithMake,
      model: 'Model 3',
      badges: ['Standard', 'Performance']
    };
    rerender(<VehicleDropdowns {...propsWithModel} />);

    expect(screen.getByLabelText(/Make \*/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/Model \*/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/Badge \*/i)).not.toBeDisabled();
  });

  it('should call appropriate handlers when selections are made', async () => {
    const user = userEvent.setup();
    const onMakeChange = jest.fn();
    const onModelChange = jest.fn();
    const onBadgeChange = jest.fn();

    const props = {
      ...defaultProps,
      make: 'Tesla',
      model: 'Model 3',
      models: ['Model 3', 'Model S', 'Model X'],
      badges: ['Standard', 'Performance', 'Long Range'],
      onMakeChange,
      onModelChange,
      onBadgeChange
    };

    render(<VehicleDropdowns {...props} />);

    // Test make selection
    await user.selectOptions(screen.getByLabelText(/Make \*/i), 'BMW');
    expect(onMakeChange).toHaveBeenCalledWith('BMW');

    // Test model selection
    await user.selectOptions(screen.getByLabelText(/Model \*/i), 'Model S');
    expect(onModelChange).toHaveBeenCalledWith('Model S');

    // Test badge selection
    await user.selectOptions(screen.getByLabelText(/Badge \*/i), 'Performance');
    expect(onBadgeChange).toHaveBeenCalledWith('Performance');
  });

  it('should display selected values correctly', () => {
    const props = {
      ...defaultProps,
      make: 'Tesla',
      model: 'Model 3',
      badge: 'Performance',
      models: ['Model 3', 'Model S'],
      badges: ['Standard', 'Performance']
    };

    render(<VehicleDropdowns {...props} />);

    expect(screen.getByLabelText(/Make \*/i)).toHaveValue('Tesla');
    expect(screen.getByLabelText(/Model \*/i)).toHaveValue('Model 3');
    expect(screen.getByLabelText(/Badge \*/i)).toHaveValue('Performance');
  });

  it('should handle empty options arrays gracefully', () => {
    const props = {
      ...defaultProps,
      make: 'Tesla',
      models: [], // Empty models
      badges: []  // Empty badges
    };

    render(<VehicleDropdowns {...props} />);

    // Model dropdown should still render with just placeholder
    const modelSelect = screen.getByLabelText(/Model \*/i);
    const modelOptions = within(modelSelect).getAllByRole('option');
    expect(modelOptions).toHaveLength(1);
    expect(modelOptions[0]).toHaveTextContent('Select a model');

    // Badge dropdown should still render with just placeholder
    const badgeSelect = screen.getByLabelText(/Badge \*/i);
    const badgeOptions = within(badgeSelect).getAllByRole('option');
    expect(badgeOptions).toHaveLength(1);
    expect(badgeOptions[0]).toHaveTextContent('Select a badge');
  });
});
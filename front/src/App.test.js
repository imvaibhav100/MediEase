import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

test('renders MeduEase brand', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const brandElements = screen.getAllByText(/MeduEase/i);
  expect(brandElements.length).toBeGreaterThan(0);
});

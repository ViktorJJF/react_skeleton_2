import { render, screen } from '@testing-library/react';
import BotAnalyticsView from '../src/views/BotAnalyticsView';

test('renders BotAnalyticsView', () => {
  render(<BotAnalyticsView />);
  const linkElement = screen.getByText(/Bot Analytics/i);
  expect(linkElement).toBeInTheDocument();
}); 
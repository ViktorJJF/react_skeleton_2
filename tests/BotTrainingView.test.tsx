import { render, screen } from '@testing-library/react';
import BotTrainingView from '../src/views/BotTrainingView';

test('renders BotTrainingView', () => {
  render(<BotTrainingView />);
  const linkElement = screen.getByText(/Bot Training/i);
  expect(linkElement).toBeInTheDocument();
}); 
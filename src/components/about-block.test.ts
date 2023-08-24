import { beforeEach, describe, it, jest } from '@jest/globals';
import { screen } from '@testing-library/dom';
import { mocked } from 'jest-mock';
import { openVideoDialog } from '../store/ui/actions';
import './about-block';

jest.mock('../store/ui/actions');

const mockToggleVideoDialogs = mocked(openVideoDialog);

describe('about-block', () => {
  beforeEach(() => {
    mockToggleVideoDialogs.mockClear();
  });

  it('defines a component', () => {
    expect(customElements.get('about-block')).toBeDefined();
  });

  it('renders details', async () => {
    // const { shadowRootForWithin } = await fixture(
    //   html`<about-block data-testid="block"></about-block>`
    // );
    // const { getByText } = within(shadowRootForWithin);

    expect(screen.getByTestId('block')).toBeInTheDocument();
    // expect(getByText(aboutBlock.title)).toBeInTheDocument();
    // expect(getByText(aboutBlock.callToAction.featuredSessions.description)).toBeInTheDocument();
    // expect(getByText(aboutBlock.statisticsBlock.attendees.number)).toBeInTheDocument();
    // expect(getByText(aboutBlock.statisticsBlock.attendees.label)).toBeInTheDocument();
  });
});

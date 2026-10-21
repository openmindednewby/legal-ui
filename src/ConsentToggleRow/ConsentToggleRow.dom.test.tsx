import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { ConsentToggleRow, makeInert } from './ConsentToggleRow';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const renderRow = (container: HTMLElement): void => {
  act(() => {
    createRoot(container).render(
      <ConsentToggleRow
        a11yHint="hint"
        description="description"
        label="Analytics"
        secondaryTextColor="gray"
        testID="row"
        textColor="black"
        trackOffColor="gray"
        trackOnColor="green"
        value={false}
        onValueChange={jest.fn()}
      />,
    );
  });
};

describe('makeInert', () => {
  it('with a DOM element, marks it inert', () => {
    const element = document.createElement('div');

    makeInert(element);

    expect(element.hasAttribute('inert')).toBe(true);
  });

  it('with a null ref, does nothing', () => {
    const run = (): void => makeInert(null);

    expect(run).not.toThrow();
  });

  it('with a native host node without setAttribute, does nothing', () => {
    const run = (): void => makeInert({ measure: jest.fn() });

    expect(run).not.toThrow();
  });
});

describe('ConsentToggleRow', () => {
  it('with an optional row, keeps the display-only switch input out of the Tab order and the accessibility tree', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    renderRow(container);

    const input = container.querySelector('input');
    expect(input?.closest('[inert]')).not.toBeNull();
    expect(input?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('with an optional row, leaves the row itself as the one named switch', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    renderRow(container);

    const row = container.querySelector('[data-testid="row"]');
    expect(row?.getAttribute('role')).toBe('switch');
    expect(row?.getAttribute('aria-label')).toBe('Analytics');
    expect(row?.getAttribute('aria-checked')).toBe('false');
  });
});

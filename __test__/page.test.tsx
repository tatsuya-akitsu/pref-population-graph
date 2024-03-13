import 'isomorphic-fetch'
import '@testing-library/jest-dom'
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils'
import Home from '../src/app/page';
import {
  MOCK_PREFECTURE_LIST,
  MOCK_PREFECTURE_TOKYO,
  MOCK_PREFECTURE_KANAGAWA,
} from '../src/app/constants/mock';
import { PC_CHART_HEIGHT_RATIO, PC_CHART_WIDTH_RATIO, PC_MAX_WIDTH, ViewLabels } from '../src/app/constants';

global.fetch = fetch

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Home', () => {
  /*
      @comment: Rechartsの単体テスト実装用想定
    */
  jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
      ...OriginalModule,
      ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <OriginalModule.ResponsiveContainer
          width={Math.round(PC_MAX_WIDTH * PC_CHART_WIDTH_RATIO)}
          height={Math.round(PC_MAX_WIDTH * PC_CHART_HEIGHT_RATIO)}
        >
          {children}
        </OriginalModule.ResponsiveContainer>
      ),
    };
  });

  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((url, options) => {
      expect(options?.headers).toEqual(
        expect.objectContaining({
          'X-API-KEY': `${process.env.RESAS_API_KEY}`,
        })
      );
      if (url === `${process.env.RESAS_API_ENDPOINT}/api/v1/prefectures`) {
        const response = new Response(JSON.stringify(MOCK_PREFECTURE_LIST), {
          status: 200,
          statusText: 'ok',
          headers: { 'Content-type': 'application/json' },
        });
        return Promise.resolve(response);
      } else if (
        url ===
        `${process.env.RESAS_API_ENDPOINT}/api/v1/population/composition/perYear?cityCode=-&prefCode=13`
      ) {
        const response = new Response(JSON.stringify(MOCK_PREFECTURE_TOKYO), {
          status: 200,
          statusText: 'ok',
          headers: { 'Content-type': 'application/json' },
        });
        return Promise.resolve(response);
      } else if (
        url ===
        `${process.env.RESAS_API_ENDPOINT}/api/v1/population/composition/perYear?cityCode=-&prefCode=14`
      ) {
        const response = new Response(
          JSON.stringify(MOCK_PREFECTURE_KANAGAWA),
          {
            status: 200,
            statusText: 'ok',
            headers: { 'Content-type': 'application/json' },
          }
        );
        return Promise.resolve(response);
      } else {
        return Promise.resolve(new Response());
      }
    });
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  describe('画面描画', () => {
    it('画面が正常に描画されていること', () => {
      render(<Home />);
      const pageElement = screen.getByText('都道府県別人口推移グラフ');
      expect(pageElement).toBeInTheDocument();
    });
  });

  describe('get()', () => {
    it('/api/v1/prefectures を呼び出す', async () => {
      act(() => {
        render(<Home />);
      });
      expect(fetch).toHaveBeenCalledTimes(1);

      const { result } = MOCK_PREFECTURE_LIST;
      for (let i = 0; i < result.length; i++) {
        const prefName = await screen.findByText(result[i].prefName);
        expect(prefName).toBeInTheDocument();
      }
    });

    it('東京都のデータを呼び出す', async () => {
      act(() => {
        render(<Home />);
      });
      expect(fetch).toHaveBeenCalledTimes(1);

      const { result } = MOCK_PREFECTURE_LIST;
      for (let i = 0; i < result.length; i++) {
        const prefName = await screen.findByText(result[i].prefName);
        expect(prefName).toBeInTheDocument();
      }
      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox', { name: '東京都' });
        const checkboxContainer = checkbox.parentElement?.parentElement;
        expect(checkboxContainer).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        expect(fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('東京都と神奈川県のデータを呼び出す', async () => {
      act(() => {
        render(<Home />);
      });
      expect(fetch).toHaveBeenCalledTimes(1);

      const { result } = MOCK_PREFECTURE_LIST;
      for (let i = 0; i < result.length; i++) {
        const prefName = await screen.findByText(result[i].prefName);
        expect(prefName).toBeInTheDocument();
      }
      await waitFor(() => {
        const checkboxValueTokyo = screen.getByRole('checkbox', {
          name: '東京都',
        });
        const checkboxValueKanagawa = screen.getByRole('checkbox', {
          name: '神奈川県',
        });
        const checkboxContainer =
          checkboxValueTokyo.parentElement?.parentElement;
        expect(checkboxContainer).toBeInTheDocument();

        expect(checkboxValueTokyo).not.toBeChecked();
        fireEvent.click(checkboxValueTokyo);
        expect(checkboxValueTokyo).toBeChecked();
        expect(fetch).toHaveBeenCalledTimes(2);

        expect(checkboxValueKanagawa).not.toBeChecked();
        fireEvent.click(checkboxValueKanagawa);
        expect(checkboxValueKanagawa).toBeChecked();
        expect(fetch).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('ui', () => {
    it('東京都の年少人口データが表示されている', async () => {
      act(() => {
        render(<Home />);
      });
      expect(fetch).toHaveBeenCalledTimes(1);

      const { result } = MOCK_PREFECTURE_LIST;
      for (let i = 0; i < result.length; i++) {
        const prefName = await screen.findByText(result[i].prefName);
        expect(prefName).toBeInTheDocument();
      }
      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox', { name: '東京都' });
        const checkboxContainer = checkbox.parentElement?.parentElement;
        expect(checkboxContainer).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        expect(fetch).toHaveBeenCalledTimes(2);
      });

      await waitFor(async () => {
        const tab = await screen.findByText(ViewLabels[1].label);
        fireEvent.click(tab)
        expect(tab.parentElement?.className.includes('isCurrent')).toBe(true)
      })
    });
  });
})

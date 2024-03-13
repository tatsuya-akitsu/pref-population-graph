import 'isomorphic-fetch'
import '@testing-library/jest-dom'
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils'
import Home from '../src/app/page';
import {
  MOCK_PREFECTURE_LIST,
  MOCK_PREFECTURE_TOKYO,
} from '../src/app/constants/mock';

global.fetch = fetch

describe('Home', () => {
  describe('画面描画', () => {
    it('画面が正常に描画されていること', () => {
      render(<Home />);
      const pageElement = screen.getByText('都道府県別人口推移グラフ');
      expect(pageElement).toBeInTheDocument();
    })
  })

  describe('get()', () => {
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
            headers: { 'Content-type': 'application/json' }
          })
          return Promise.resolve(response)
        } else if (url === `${process.env.RESAS_API_ENDPOINT}/api/v1/population/composition/perYear?cityCode=-&prefCode=13`) {
          const response = new Response(JSON.stringify(MOCK_PREFECTURE_TOKYO), {
            status: 200,
            statusText: 'ok',
            headers: { 'Content-type': 'application/json' },
          });
          return Promise.resolve(response)
        } else {
          return Promise.resolve(new Response())
        }
      })
    })

    afterEach(() => {
      cleanup()
      jest.restoreAllMocks();
    })
    it('/api/v1/prefectures を呼び出す', async () => {
      act(() => {
        render(<Home />)
      })
      expect(fetch).toHaveBeenCalledTimes(1)

      const { result } = MOCK_PREFECTURE_LIST;
      for (let i = 0; i < result.length; i++) {
        const prefName = await screen.findByText(result[i].prefName);
        expect(prefName).toBeInTheDocument();
      }
    });

    it('/api/v1/population/composition/perYear?cityCode=-&prefCode={code} を呼び出す（東京都）', async () => {
      act(() => {
        render(<Home />);
      });
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
})

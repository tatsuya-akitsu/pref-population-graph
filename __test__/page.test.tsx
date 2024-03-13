import '@testing-library/jest-dom'
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';
import { MOCK_PREFECTURE_LIST } from '../src/app/constants/mock'

describe('Home', () => {
  const prefecturesData = () =>
    Promise.resolve({ ok: true, status: 200, data: MOCK_PREFECTURE_LIST });
  global.fetch = jest.fn().mockResolvedValue(prefecturesData);

  beforeEach(() => jest.clearAllMocks());

  describe('get()', () => {
    it('/api/v1/prefectures を呼び出す', async () => {
      render(<Home />);

      console.log(prefecturesData);

      const pageElement = screen.getByText('都道府県別人口推移グラフ');
      expect(pageElement).toBeInTheDocument();
    });
  });
})

import { ExprCalcPage } from './app.po';

describe('exprcalc App', () => {
  let page: ExprCalcPage;

  beforeEach(() => {
    page = new ExprCalcPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

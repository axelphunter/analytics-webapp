describe('Configuration setup', () => {
  it('should load development configurations', (next) => {
    const config = require('../config/config')();
    expect(config.mode)
      .toBe('development');
    next();
  });
  it("should load staging configurations", function (next) {
    var config = require('../config/config')('staging');
    expect(config.mode)
      .toBe('staging');
    next();
  });
  it("should load production configurations", function (next) {
    var config = require('../config/config')('production');
    expect(config.mode)
      .toBe('production');
    next();
  });
});

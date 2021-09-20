const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit} = require('../src/math')

test('Should calculate total with tip',() => {
    const total = calculateTip(100,.3)
    expect(total).toBe(130)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(100)
    expect(total).toBe(120)
})

test('Should convert 32 F to 0 C', () => {
    const c = fahrenheitToCelsius(32)
    expect(c).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const f = celsiusToFahrenheit(0)
    expect(f).toBe(32)
})
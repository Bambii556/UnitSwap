# Unit Converter Tests

This directory contains comprehensive test suites for all unit converter modules in the UnitSwap application.

## Test Coverage

### Individual Converter Tests

- **Weight Converter** (`weight.test.ts`) - Tests weight conversions between kg, g, lb, oz, ton
- **Length Converter** (`length.test.ts`) - Tests length conversions between m, cm, in, ft, yd, km, mi
- **Temperature Converter** (`temp.test.ts`) - Tests temperature conversions between C, F, K
- **Volume Converter** (`volume.test.ts`) - Tests volume conversions between ml, L, tsp, tbsp, cup, fl_oz
- **Speed Converter** (`speed.test.ts`) - Tests speed conversions between kph, mph, mps, fps
- **Time Converter** (`time.test.ts`) - Tests time conversions between s, min, hr, day, week, month, year
- **Area Converter** (`area.test.ts`) - Tests area conversions between sqm, sqft, sqkm, sqmi, acre, hectare
- **Data Converter** (`data.test.ts`) - Tests data conversions between byte, kb, mb, gb, tb

### Integration Tests

- **Main Conversion Function** (`index.test.ts`) - Tests the unified `convert()` function with all categories

## Test Features

### Comprehensive Test Coverage

- ✅ **Basic conversions**: Each unit to each other unit
- ✅ **Same unit conversions**: Converting a unit to itself
- ✅ **Edge cases**: Zero values, negative values, decimal values
- ✅ **Large numbers**: Testing with very large values
- ✅ **Precision**: Verifying conversion accuracy with appropriate precision
- ✅ **Error handling**: Invalid inputs, missing rates, null/NaN values

### Error Handling Tests

- Null values
- NaN values
- Invalid unit keys
- Division by zero protection

### Structure Validation Tests

- Category names and properties
- Unit structure validation
- Convert function existence
- Base unit verification (where applicable)

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Converter Tests

```bash
# Test specific converter
npm test -- weight.test.ts

# Test multiple converters
npm test -- weight.test.ts length.test.ts
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

## Test Statistics

- **Total Test Files**: 10
- **Total Tests**: 237
- **Test Categories**: 9 converter categories + 1 integration test
- **Coverage**: All conversion functions and edge cases

## Test Output

The console output may show some expected console logs and warnings:

- Currency rate warnings (expected for mocked currency API)
- Error messages for invalid inputs (expected behavior)

These are normal and indicate that error handling is working correctly.

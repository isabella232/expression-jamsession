import glExpressionShorthand from '../src/index';

describe('literals', () => {
  test('7', () => {
    const actual = glExpressionShorthand('7');
    expect(actual).toBe(7);
  });

  test('77.323', () => {
    const actual = glExpressionShorthand('77.323');
    expect(actual).toBe(77.323);
  });

  test('sing', () => {
    const actual = glExpressionShorthand('"sing"');
    expect(actual).toBe('sing');
  });

  test('true', () => {
    const actual = glExpressionShorthand('true');
    expect(actual).toBe(true);
  });

  test('false', () => {
    const actual = glExpressionShorthand('false');
    expect(actual).toBe(false);
  });
});

describe('formulas', () => {
  test('-3', () => {
    const actual = glExpressionShorthand('-3');
    expect(actual).toEqual(['-', 3]);
  });

  test('-(3 + 4)', () => {
    const actual = glExpressionShorthand('-(3 + 4)');
    expect(actual).toEqual(['-', ['+', 3, 4]]);
  });

  test('3 + 4', () => {
    const actual = glExpressionShorthand('3 + 4');
    expect(actual).toEqual(['+', 3, 4]);
  });

  test('(3 + 4) / 7', () => {
    const actual = glExpressionShorthand('(3 + 4) / 7');
    expect(actual).toEqual(['/', ['+', 3, 4], 7]);
  });

  test('((3 + 4) * 2) / 7', () => {
    const actual = glExpressionShorthand('((3 + 4) * 2) / 7');
    expect(actual).toEqual(['/', ['*', ['+', 3, 4], 2], 7]);
  });

  test('log2(3)', () => {
    const actual = glExpressionShorthand('log2(3)');
    expect(actual).toEqual(['log2', 3]);
  });

  test('log2((3 + 4) / 7)', () => {
    const actual = glExpressionShorthand('log2((3 + 4) / 7)');
    expect(actual).toEqual(['log2', ['/', ['+', 3, 4], 7]]);
  });

  test('min(2, 4, 6)', () => {
    const actual = glExpressionShorthand('min(2, 4, 6)');
    expect(actual).toEqual(['min', 2, 4, 6]);
  });

  test('max(2, 4, 6)', () => {
    const actual = glExpressionShorthand('max(2, 4, 6)');
    expect(actual).toEqual(['max', 2, 4, 6]);
  });

  test('max(2, 4, ((3 + 4) / 7))', () => {
    const actual = glExpressionShorthand('max(2, 4, ((3 + 4) / 7))');
    expect(actual).toEqual(['max', 2, 4, ['/', ['+', 3, 4], 7]]);
  });

  test('max(3, log2(6))', () => {
    const actual = glExpressionShorthand('max(3, log2(6))');
    expect(actual).toEqual(['max', 3, ['log2', 6]]);
  });

  test(`"there are " & get("population") & " people " & upper("here " & "not there")`, () => {
    const actual = glExpressionShorthand(
      `"there are " & get("population") & " people " & upper("here " & "not there")`
    );
    expect(actual).toEqual([
      'concat',
      'there are ',
      ['get', 'population'],
      ' people ',
      ['upper', ['concat', 'here ', 'not there']]
    ]);
  });

  test(`concat("there are ", get("population"), " people ", upper(concat("here ", "not there")))`, () => {
    const actual = glExpressionShorthand(
      `concat("there are ", get("population"), " people ", upper(concat("here ", "not there")))`
    );
    expect(actual).toEqual([
      'concat',
      'there are ',
      ['get', 'population'],
      ' people ',
      ['upper', ['concat', 'here ', 'not there']]
    ]);
  });
});

describe('syntax errors', () => {
  test('3 +', () => {
    const actual = () => {
      glExpressionShorthand('3 +');
    };
    expect(actual).toThrow('Syntax error');

    expect.hasAssertions();
    try {
      glExpressionShorthand('3 +');
    } catch (error) {
      expect(error.type).toBe('SyntaxError');
      expect(error.index).toBe(3);
      expect(error.description).toBe('Expected value after +');
    }
  });

  test('e.', () => {
    const actual = () => {
      glExpressionShorthand('e.');
    };
    expect(actual).toThrow('Syntax error');

    expect.hasAssertions();
    try {
      glExpressionShorthand('e.');
    } catch (error) {
      expect(error.type).toBe('SyntaxError');
      expect(error.index).toBe(2);
      expect(error.description).toBe('Unexpected input');
    }
  });
});
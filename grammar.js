module.exports = grammar({
  name: 'haxe',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.type_parameter, $.type_path],
    [$.function_type, $.parenthesized_expression],
    [$.parameter, $.type_path],
    [$.type, $.type_path],
    [$.block, $.object_literal],
  ],

  rules: {
    source_file: $ => repeat($._declaration),

    _declaration: $ => choice(
      $.package_declaration,
      $.import_declaration,
      $.using_declaration,
      $.class_declaration,
      $.interface_declaration,
      $.enum_declaration,
      $.typedef_declaration,
      $.abstract_declaration,
    ),

    // Package and imports
    package_declaration: $ => seq(
      'package',
      optional($.type_path),
      ';'
    ),

    import_declaration: $ => seq(
      'import',
      $.type_path,
      optional(seq('in', $.identifier)),
      optional(seq('as', $.identifier)),
      ';'
    ),

    using_declaration: $ => seq(
      'using',
      $.type_path,
      ';'
    ),

    // Class declaration
    class_declaration: $ => seq(
      repeat($.metadata),
      repeat($.modifier),
      'class',
      field('name', $.identifier),
      optional($.type_parameters),
      optional($.extends_clause),
      optional($.implements_clause),
      field('body', $.class_body)
    ),

    // Interface declaration
    interface_declaration: $ => seq(
      repeat($.metadata),
      repeat($.modifier),
      'interface',
      field('name', $.identifier),
      optional($.type_parameters),
      optional($.extends_clause),
      field('body', $.class_body)
    ),

    // Enum declaration
    enum_declaration: $ => seq(
      repeat($.metadata),
      repeat($.modifier),
      'enum',
      field('name', $.identifier),
      optional($.type_parameters),
      field('body', $.enum_body)
    ),

    enum_body: $ => seq(
      '{',
      repeat($.enum_constructor),
      '}'
    ),

    enum_constructor: $ => seq(
      repeat($.metadata),
      $.identifier,
      optional($.enum_constructor_parameters),
      optional(';')
    ),

    enum_constructor_parameters: $ => seq(
      '(',
      sepBy(',', $.enum_constructor_parameter),
      ')'
    ),

    enum_constructor_parameter: $ => seq(
      optional('?'),
      $.identifier,
      ':',
      $.type
    ),

    // Typedef declaration
    typedef_declaration: $ => seq(
      repeat($.metadata),
      repeat($.modifier),
      'typedef',
      field('name', $.identifier),
      optional($.type_parameters),
      '=',
      $.type,
      optional(';')
    ),

    // Abstract declaration
    abstract_declaration: $ => seq(
      repeat($.metadata),
      repeat($.modifier),
      'abstract',
      field('name', $.identifier),
      optional($.type_parameters),
      optional(seq('(', $.type, ')')),
      optional($.abstract_relations),
      field('body', $.class_body)
    ),

    abstract_relations: $ => repeat1(choice(
      seq('to', $.type),
      seq('from', $.type)
    )),

    extends_clause: $ => seq(
      'extends',
      $.type_path
    ),

    implements_clause: $ => seq(
      'implements',
      sepBy1(',', $.type_path)
    ),

    class_body: $ => seq(
      '{',
      repeat($._class_member),
      '}'
    ),

    _class_member: $ => choice(
      $.field_declaration,
      $.method_declaration,
      $.property_declaration,
    ),

    field_declaration: $ => seq(
      repeat($.metadata),
      repeat($.modifier),
      'var',
      field('name', $.identifier),
      optional(seq(':', $.type)),
      optional(seq('=', $._expression)),
      ';'
    ),

    method_declaration: $ => seq(
      repeat($.metadata),
      repeat($.modifier),
      'function',
      field('name', $.identifier),
      optional($.type_parameters),
      $.parameter_list,
      optional(seq(':', $.type)),
      choice($.block, ';')
    ),

    property_declaration: $ => seq(
      repeat($.metadata),
      repeat($.modifier),
      'var',
      field('name', $.identifier),
      '(',
      $.property_accessor,
      ',',
      $.property_accessor,
      ')',
      optional(seq(':', $.type)),
      optional(seq('=', $._expression)),
      ';'
    ),

    property_accessor: $ => choice(
      'default',
      'null',
      'get',
      'set',
      'dynamic',
      'never'
    ),

    modifier: $ => choice(
      'public',
      'private',
      'static',
      'override',
      'dynamic',
      'inline',
      'macro',
      'final',
      'extern',
    ),

    metadata: $ => seq(
      '@',
      optional(':'),
      $.identifier,
      optional($.metadata_arguments)
    ),

    metadata_arguments: $ => seq(
      '(',
      sepBy(',', $._expression),
      ')'
    ),

    parameter_list: $ => seq(
      '(',
      sepBy(',', $.parameter),
      ')'
    ),

    parameter: $ => prec(2, seq(
      optional('?'),
      $.identifier,
      optional(seq(':', $.type)),
      optional(seq('=', $._expression))
    )),

    type_parameters: $ => seq(
      '<',
      sepBy1(',', $.type_parameter),
      '>'
    ),

    type_parameter: $ => seq(
      $.identifier,
      optional(seq(':', $.type))
    ),

    // Types
    type: $ => choice(
      $.type_path,
      $.function_type,
      $.parenthesized_type,
      $.array_type,
      $.anonymous_structure_type,
    ),

    type_path: $ => prec(1, seq(
      sepBy1('.', $.identifier),
      optional($.type_arguments)
    )),

    type_arguments: $ => seq(
      '<',
      sepBy1(',', $.type),
      '>'
    ),

    function_type: $ => prec.right(1, seq(
      choice(
        $.parenthesized_type,
        $.type_path
      ),
      '->',
      $.type
    )),

    parenthesized_type: $ => seq('(', $.type, ')'),

    array_type: $ => seq('Array', '<', $.type, '>'),

    anonymous_structure_type: $ => seq(
      '{',
      sepBy(',', $.structure_field),
      '}'
    ),

    structure_field: $ => seq(
      optional('?'),
      $.identifier,
      ':',
      $.type
    ),

    // Statements
    _statement: $ => choice(
      $.block,
      $.variable_declaration,
      $.expression_statement,
      $.if_statement,
      $.while_statement,
      $.do_while_statement,
      $.for_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.switch_statement,
      $.try_statement,
      $.throw_statement,
    ),

    block: $ => seq(
      '{',
      repeat($._statement),
      '}'
    ),

    variable_declaration: $ => seq(
      'var',
      $.identifier,
      optional(seq(':', $.type)),
      optional(seq('=', $._expression)),
      ';'
    ),

    expression_statement: $ => seq($._expression, ';'),

    if_statement: $ => prec.right(seq(
      'if',
      '(',
      $._expression,
      ')',
      $._statement,
      optional(seq('else', $._statement))
    )),

    while_statement: $ => seq(
      'while',
      '(',
      $._expression,
      ')',
      $._statement
    ),

    do_while_statement: $ => seq(
      'do',
      $._statement,
      'while',
      '(',
      $._expression,
      ')',
      ';'
    ),

    for_statement: $ => seq(
      'for',
      '(',
      $.identifier,
      'in',
      $._expression,
      ')',
      $._statement
    ),

    return_statement: $ => seq(
      'return',
      optional($._expression),
      ';'
    ),

    break_statement: $ => seq('break', ';'),

    continue_statement: $ => seq('continue', ';'),

    switch_statement: $ => seq(
      'switch',
      $._expression,
      '{',
      repeat($.case_clause),
      optional($.default_clause),
      '}'
    ),

    case_clause: $ => seq(
      'case',
      sepBy1(',', $._expression),
      optional($.case_guard),
      ':',
      repeat($._statement)
    ),

    case_guard: $ => seq('if', '(', $._expression, ')'),

    default_clause: $ => seq(
      'default',
      ':',
      repeat($._statement)
    ),

    try_statement: $ => seq(
      'try',
      $.block,
      repeat($.catch_clause)
    ),

    catch_clause: $ => seq(
      'catch',
      '(',
      $.identifier,
      ':',
      $.type,
      ')',
      $.block
    ),

    throw_statement: $ => seq('throw', $._expression, ';'),

    // Expressions
    _expression: $ => choice(
      $.identifier,
      $.literal,
      $.string_literal,
      $.this_expression,
      $.super_expression,
      $.array_literal,
      $.object_literal,
      $.parenthesized_expression,
      $.unary_expression,
      $.binary_expression,
      $.ternary_expression,
      $.call_expression,
      $.member_expression,
      $.array_access_expression,
      $.new_expression,
      $.cast_expression,
      $.function_expression,
      $.macro_expression,
    ),

    this_expression: $ => 'this',
    super_expression: $ => 'super',

    array_literal: $ => seq(
      '[',
      sepBy(',', $._expression),
      ']'
    ),

    object_literal: $ => seq(
      '{',
      sepBy(',', $.object_field),
      '}'
    ),

    object_field: $ => seq(
      choice($.identifier, $.string_literal),
      ':',
      $._expression
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    unary_expression: $ => choice(
      prec.left(14, seq(choice('!', '~', '-', '+', '++', '--'), $._expression)),
      prec.left(14, seq($._expression, choice('++', '--'))),
    ),

    binary_expression: $ => {
      const table = [
        [13, choice('*', '/', '%')],
        [12, choice('+', '-')],
        [11, choice('<<', '>>', '>>>')],
        [10, choice('<', '>', '<=', '>=')],
        [9, choice('==', '!=')],
        [8, '&'],
        [7, '^'],
        [6, '|'],
        [5, '&&'],
        [4, '||'],
        [2, choice('=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>>=')],
      ];

      return choice(...table.map(([precedence, operator]) =>
        prec.left(precedence, seq(
          $._expression,
          operator,
          $._expression
        ))
      ));
    },

    ternary_expression: $ => prec.right(3, seq(
      $._expression,
      '?',
      $._expression,
      ':',
      $._expression
    )),

    call_expression: $ => prec(15, seq(
      $._expression,
      $.arguments
    )),

    arguments: $ => seq(
      '(',
      sepBy(',', $._expression),
      ')'
    ),

    member_expression: $ => prec(15, seq(
      $._expression,
      '.',
      $.identifier
    )),

    array_access_expression: $ => prec(15, seq(
      $._expression,
      '[',
      $._expression,
      ']'
    )),

    new_expression: $ => prec(14, seq(
      'new',
      $.type_path,
      $.arguments
    )),

    cast_expression: $ => seq(
      'cast',
      choice(
        $._expression,
        seq('(', $._expression, ',', $.type, ')')
      )
    ),

    function_expression: $ => seq(
      'function',
      optional($.parameter_list),
      optional(seq(':', $.type)),
      $.block
    ),

    macro_expression: $ => seq(
      'macro',
      choice($._expression, $.block)
    ),

    // Literals
    literal: $ => choice(
      $.number,
      $.boolean,
      $.null,
      $.regex,
    ),

    number: $ => token(choice(
      /\d+\.?\d*([eE][+-]?\d+)?/,
      /0[xX][0-9a-fA-F]+/,
    )),

    boolean: $ => choice('true', 'false'),

    null: $ => 'null',

    string_literal: $ => choice(
      seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
      seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
    ),

    regex: $ => /~\/([^\/\\]|\\.)*\/[gimsu]*/,

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => choice(
      token(seq('//', /.*/)),
      token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'))
    ),
  }
});

function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}

function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}

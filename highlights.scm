
; Keywords
[
  "abstract"
  "break"
  "case"
  "cast"
  "catch"
  "class"
  "continue"
  "default"
  "do"
  "dynamic"
  "else"
  "enum"
  "extends"
  "extern"
  "final"
  "for"
  "function"
  "if"
  "implements"
  "import"
  "in"
  "inline"
  "interface"
  "macro"
  "new"
  "override"
  "package"
  "private"
  "public"
  "return"
  "static"
  "switch"
  "throw"
  "try"
  "typedef"
  "using"
  "var"
  "while"
] @keyword

; Special keywords
[
  "this"
  "super"
] @variable.builtin

; Type keywords
[
  "from"
  "to"
] @keyword

; Literals
(boolean) @constant.builtin.boolean
(null) @constant.builtin
(number) @constant.numeric
(string_literal) @string
(regex) @string.regex

; Comments
(comment) @comment

; Functions
(method_declaration
  name: (identifier) @function.method)

(function_expression) @function

(call_expression
  (identifier) @function.call)

(call_expression
  (member_expression
    (identifier) @function.method.call))

; Types
(class_declaration
  name: (identifier) @type)

(interface_declaration
  name: (identifier) @type)

(enum_declaration
  name: (identifier) @type)

(typedef_declaration
  name: (identifier) @type)

(abstract_declaration
  name: (identifier) @type)

(type_path
  (identifier) @type)

(enum_constructor
  (identifier) @type.enum.variant)

; Type parameters
(type_parameter
  (identifier) @type.parameter)

; Properties and fields
(field_declaration
  name: (identifier) @variable.member)

(property_declaration
  name: (identifier) @variable.member)

(object_field
  (identifier) @variable.member)

(member_expression
  (identifier) @variable.member)

; Parameters
(parameter
  (identifier) @variable.parameter)

; Metadata/Annotations
(metadata
  "@" @punctuation.special
  (identifier) @attribute)

; Operators
[
  "!"
  "~"
  "-"
  "+"
  "*"
  "/"
  "%"
  "<<"
  ">>"
  ">>>"
  "<"
  ">"
  "<="
  ">="
  "=="
  "!="
  "&"
  "^"
  "|"
  "&&"
  "||"
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "&="
  "|="
  "^="
  "<<="
  ">>="
  ">>>="
  "++"
  "--"
  "?"
  ":"
  "->"
] @operator

; Punctuation
[
  ";"
  "."
  ","
] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

; Property accessors
(property_accessor) @keyword

; Identifiers (fallback)
(identifier) @variable

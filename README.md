
# Haxe Tree-sitter Grammar for Helix

This is a tree-sitter grammar for the Haxe programming language, configured for use with the Helix editor.

## Setup Instructions

### 1. Install Prerequisites

Make sure you have the following installed:
- Node.js and npm
- A C compiler (gcc or clang)
- tree-sitter-cli

```bash
npm install -g tree-sitter-cli
```

### 2. Build the Parser

In the directory containing `grammar.js`:

```bash
# Install dependencies
npm install

# Generate the parser
tree-sitter generate

# Test the parser (optional)
tree-sitter test
```

### 3. Set Up for Helix

#### Option A: Manual Setup

1. Create the Helix runtime directory structure:
```bash
mkdir -p ~/.config/helix/runtime/grammars
mkdir -p ~/.config/helix/runtime/queries/haxe
```

2. Build and copy the parser:
```bash
# Build the parser library
tree-sitter build --wasm  # Or without --wasm for native library

# Copy the compiled parser
cp tree-sitter-haxe.wasm ~/.config/helix/runtime/grammars/  # For WASM
# OR
cp target/release/libtree-sitter-haxe.so ~/.config/helix/runtime/grammars/haxe.so  # For native
```

3. Copy the highlights file:
```bash
cp highlights.scm ~/.config/helix/runtime/queries/haxe/
```

4. Add to your Helix languages.toml (`~/.config/helix/languages.toml`):
```toml
[[language]]
name = "haxe"
scope = "source.haxe"
injection-regex = "haxe"
file-types = ["hx"]
roots = ["haxe.json", ".git"]
comment-token = "//"
indent = { tab-width = 4, unit = "    " }

[[grammar]]
name = "haxe"
source = { path = "/path/to/tree-sitter-haxe" }
```

#### Option B: Using hx Command (Recommended)

If you use the `hx --grammar fetch` and `hx --grammar build` commands:

1. Add the grammar source to your `languages.toml`:
```toml
[[language]]
name = "haxe"
scope = "source.haxe"
injection-regex = "haxe"
file-types = ["hx"]
roots = ["haxe.json", ".git"]
comment-token = "//"
indent = { tab-width = 4, unit = "    " }

[[grammar]]
name = "haxe"
source = { git = "https://github.com/your-username/tree-sitter-haxe", rev = "main" }
```

2. Manually copy queries:
```bash
mkdir -p ~/.config/helix/runtime/queries/haxe
cp highlights.scm ~/.config/helix/runtime/queries/haxe/
```

3. Fetch and build:
```bash
hx --grammar fetch
hx --grammar build
```

### 4. Verify Installation

1. Open a Haxe file (.hx) in Helix
2. Run `:log-open` in Helix to check for any errors
3. Verify syntax highlighting is working

## Project Structure

```
tree-sitter-haxe/
├── grammar.js           # Tree-sitter grammar definition
├── package.json         # NPM package configuration
├── highlights.scm       # Syntax highlighting queries
└── README.md           # This file
```

## Supported Haxe Features

This grammar supports:
- Classes, interfaces, enums, typedefs, and abstracts
- Function declarations and expressions
- Type parameters and constraints
- Metadata annotations
- Package and import statements
- All standard control flow statements
- Pattern matching in switch statements
- Macros (basic support)
- Properties with accessors
- Anonymous structures
- String interpolation

## Troubleshooting

### Parser doesn't load
- Check `~/.config/helix/runtime/grammars/` contains the parser library
- Verify the library has the correct name (haxe.so or tree-sitter-haxe.wasm)
- Check Helix logs with `:log-open`

### No syntax highlighting
- Ensure `highlights.scm` is in `~/.config/helix/runtime/queries/haxe/`
- Verify file extension is `.hx`
- Try restarting Helix

### Build errors
- Ensure you have a C compiler installed
- Try `npm install` again to get dependencies
- Check that tree-sitter-cli is up to date

## Contributing

To improve the grammar:
1. Edit `grammar.js`
2. Run `tree-sitter generate`
3. Test with `tree-sitter parse example.hx`
4. Update `highlights.scm` for new node types

## License

MIT

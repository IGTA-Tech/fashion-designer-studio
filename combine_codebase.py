#!/usr/bin/env python3
"""
Combine all code files from the fashion-designer-studio repo into a single text file.
"""

import os

# Configuration
repo_path = '/home/innovativeautomations/fashion-designer-studio'
output_file = '/home/innovativeautomations/fashion-designer-studio/COMPLETE_CODEBASE.txt'

# Directories to exclude
exclude_dirs = {'.git', 'node_modules', '__pycache__', 'dist', 'build', '.netlify', 'coverage', '.vscode', '.idea'}

# File extensions to include
include_extensions = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.md', '.json', '.html', '.css',
    '.env.example', '.gitignore', '.yml', '.yaml', '.toml', '.config.js'
}

def should_include_file(filename):
    """Check if file should be included based on extension."""
    # Check for specific filenames without extension
    if filename in ['.env.example', '.gitignore', 'Dockerfile', 'Makefile']:
        return True
    # Check extensions
    return any(filename.endswith(ext) for ext in include_extensions)

def combine_codebase():
    """Walk through repo and combine all relevant files."""
    output = []
    file_count = 0

    print(f"Scanning repository: {repo_path}")
    print(f"Output file: {output_file}")
    print("-" * 60)

    for root, dirs, files in os.walk(repo_path):
        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        # Sort for consistent output
        files.sort()

        for file in files:
            if should_include_file(file):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, repo_path)

                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        output.append(f"{'='*80}")
                        output.append(f"FILE: {relative_path}")
                        output.append(f"{'='*80}")
                        output.append(content)
                        output.append(f"\n")
                        file_count += 1
                        print(f"✓ Added: {relative_path}")
                except Exception as e:
                    print(f"✗ Error reading {relative_path}: {e}")

    # Write combined output
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(output))
        print("-" * 60)
        print(f"✓ Successfully combined {file_count} files")
        print(f"✓ Output saved to: {output_file}")

        # Get file size
        size_bytes = os.path.getsize(output_file)
        size_mb = size_bytes / (1024 * 1024)
        print(f"✓ File size: {size_mb:.2f} MB ({size_bytes:,} bytes)")
    except Exception as e:
        print(f"✗ Error writing output file: {e}")

if __name__ == "__main__":
    combine_codebase()

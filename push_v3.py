#!/usr/bin/env python3
import os
import subprocess
import json

def cmd(command, cwd=None):
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True, timeout=60)
        return result.returncode == 0, result.stdout + result.stderr
    except:
        return False, "Error"

def main():
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        print("ERROR: Set GITHUB_TOKEN first")
        return
    
    print(f"Token: {token[:4]}...{token[-4:]}")
    print("Step 1: Check user")
    
    ok, out = cmd(f'curl -s -H "Authorization: token {token}" https://api.github.com/user')
    if not ok or '"login"' not in out:
        print("Token invalid")
        return
    
    user = json.loads(out)
    username = user['login']
    print(f"Username: {username}")
    
    print("\nStep 2: Create repo")
    repo_json = json.dumps({"name": "fangzhedie", "description": "WeChat Anti-Fold Mini Program", "private": False})
    
    cmd_str = f'curl -s -X POST -H "Authorization: token {token}" -H "Content-Type: application/json" -d \'{repo_json}\' https://api.github.com/user/repos'
    ok, out = cmd(cmd_str)
    
    if '"html_url"' in out:
        print("Repo created!")
    elif 'already exists' in out:
        print("Repo already exists")
    else:
        print(f"Response: {out[:200]}")
        return
    
    print("\nStep 3: Push code")
    project_dir = r"g:\【0】209 Python\小程序\FangZheDie"
    
    cmd(f'git remote remove origin 2>nul', project_dir)
    ok, _ = cmd(f'git remote add origin https://github.com/{username}/fangzhedie.git', project_dir)
    cmd(f'git branch -M main', project_dir)
    
    print("Pushing...")
    ok, out = cmd(f'git push -u origin main --force', project_dir)
    
    if ok:
        print("\n" + "="*50)
        print("SUCCESS!")
        print("="*50)
        print(f"URL: https://github.com/{username}/fangzhedie")
    else:
        print(f"Push failed: {out}")

if __name__ == "__main__":
    main()
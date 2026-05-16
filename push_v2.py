#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import subprocess

def run_cmd(cmd, cwd=None):
    """Run command and return result"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=60
        )
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return 1, "", str(e)

def main():
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        print("ERROR: GITHUB_TOKEN not set")
        return
    
    print(f"Token: {token[:4]}...{token[-4:]}")
    
    # Test token
    code, out, err = run_cmd(
        f'curl -s -H "Authorization: token {token}" https://api.github.com/user'
    )
    
    if code == 0 and '"login"' in out:
        import json
        user = json.loads(out)
        username = user.get('login')
        print(f"Username: {username}")
        
        # Create repo
        repo_data = {
            "name": "fangzhedie",
            "description": "WeChat Moments Anti-Fold Mini Program",
            "private": False
        }
        
        import json
        create_cmd = f'curl -s -X POST -H "Authorization: token {token}" -H "Content-Type: application/json" https://api.github.com/user/repos -d \'{json.dumps(repo_data)}\''
        code, out, err = run_cmd(create_cmd)
        
        if '"html_url"' in out or '"message"' in out and 'already exists' in out:
            print("Repo ready or already exists")
            
            # Push
            project_dir = r"g:\【0】209 Python\小程序\FangZheDie"
            os.chdir(project_dir)
            
            # Clean git lock
            lock_file = os.path.join(project_dir, ".git", "config.lock")
            if os.path.exists(lock_file):
                os.remove(lock_file)
            
            # Remove origin and add
            run_cmd("git remote remove origin 2>nul", project_dir)
            run_cmd(f'git remote add origin https://github.com/{username}/fangzhedie.git', project_dir)
            run_cmd("git branch -M main", project_dir)
            
            # Push
            print("Pushing...")
            code, out, err = run_cmd("git push -u origin main --force", project_dir)
            
            if code == 0:
                print("SUCCESS!")
                print(f"URL: https://github.com/{username}/fangzhedie")
            else:
                print(f"Push failed: {err}")
        else:
            print(f"Repo creation failed: {out}")
    else:
        print("Token invalid")

if __name__ == "__main__":
    main()
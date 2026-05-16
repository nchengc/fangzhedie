#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import json
import urllib.request
import urllib.error

def github_api(method, endpoint, data=None, token=None):
    """Use GitHub API"""
    url = f"https://api.github.com{endpoint}"
    
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "FangZheDie-Pusher/1.0"
    }
    
    if token:
        headers["Authorization"] = f"token {token}"
    
    if data:
        headers["Content-Type"] = "application/json"
        data = json.dumps(data).encode('utf-8')
    
    try:
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else ""
        print(f"HTTP Error {e.code}: {error_body}")
        return None
    except urllib.error.URLError as e:
        print(f"Connection Error: {e.reason}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    print("Starting push to GitHub...")
    
    # 1. Get token
    token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
    
    if not token:
        print("ERROR: GitHub Token not found!")
        print("\nPlease set token:")
        print("   $env:GITHUB_TOKEN = 'your_token'")
        return
    
    print(f"Token found: {token[:4]}...{token[-4:]}")
    
    # 2. Get username
    user_info = github_api("GET", "/user", token=token)
    if not user_info:
        print("ERROR: Cannot get user info, check token")
        return
    
    username = user_info.get('login')
    print(f"GitHub Username: {username}")
    
    # 3. Create repo
    repo_name = "fangzhedie"
    repo_description = "WeChat Moments Anti-Fold Mini Program - Cyberpunk Neon Style UI"
    
    print(f"\nCreating repo: {repo_name}...")
    
    repo_data = github_api(
        "POST",
        "/user/repos",
        data={
            "name": repo_name,
            "description": repo_description,
            "private": False,
            "auto_init": False,
            "has_issues": True,
            "has_wiki": False
        },
        token=token
    )
    
    if not repo_data:
        print("ERROR: Repo creation failed, may already exist")
        return
    
    repo_url = repo_data.get('clone_url')
    print(f"Repo created: {repo_url}")
    
    # 4. Push code
    print(f"\nPushing code to GitHub...")
    
    project_dir = r"g:\【0】209 Python\小程序\FangZheDie"
    os.chdir(project_dir)
    
    # Remove old remote and add new
    os.system('git remote remove origin 2>nul')
    os.system(f'git remote add origin {repo_url}')
    os.system('git branch -M main')
    
    # Push
    result = os.system('git push -u origin main --force')
    
    if result == 0:
        print(f"\nPush SUCCESS!")
        print(f"Repo URL: https://github.com/{username}/{repo_name}")
    else:
        print(f"\nPush FAILED, please run manually: git push -u origin main")

if __name__ == "__main__":
    main()
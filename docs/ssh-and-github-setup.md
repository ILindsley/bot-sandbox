# SSH and GitHub CLI Setup

This guide walks through setting up SSH keys and the GitHub CLI (`gh`) inside the bot-sandbox VM so you can push to GitHub from within the VM.

## Security Considerations

Before proceeding, understand the tradeoffs:

- **SSH keys in the VM are readable by the AI assistant** - there's no way to give push access without some credential being accessible
- **The VM has outbound network access** - a compromised model could theoretically exfiltrate data
- **Mitigation**: Use a [deploy key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#deploy-keys) limited to specific repos instead of an account-wide SSH key

The sandbox protects your host machine, but the trust model ultimately relies on the AI model not being malicious.

## Step 1: Create SSH Directory

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

## Step 2: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "bot-sandbox" -f ~/.ssh/id_ed25519 -N ""
```

- `-t ed25519`: Modern, secure key type
- `-C "bot-sandbox"`: Comment to identify the key
- `-f ~/.ssh/id_ed25519`: Output file path
- `-N ""`: No passphrase (required for non-interactive use)

## Step 3: Configure SSH

Create `~/.ssh/config` to map the host alias used by your repos:

```bash
cat > ~/.ssh/config << 'EOF'
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config ~/.ssh/id_ed25519
```

> **Note**: Check your repo's remote URL with `git remote -v`. If it uses `github.com` instead of `github-personal`, adjust the `Host` line accordingly.

## Step 4: Add Public Key to GitHub

Display your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Then add it to GitHub:

1. Go to https://github.com/settings/keys
2. Click **New SSH key**
3. Title: `bot-sandbox` (or any identifier)
4. Key type: **Authentication Key**
5. Paste the public key
6. Click **Add SSH key**

### Alternative: Use a Deploy Key (Recommended)

For better security, add the key to a specific repo instead of your account:

1. Go to your repo → **Settings** → **Deploy keys**
2. Click **Add deploy key**
3. Title: `bot-sandbox`
4. Paste the public key
5. Check **Allow write access** if you need to push
6. Click **Add key**

This limits the key to a single repository.

## Step 5: Install GitHub CLI

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

## Step 6: Authenticate GitHub CLI

```bash
gh auth login
```

When prompted:

1. **Where do you use GitHub?** → `GitHub.com`
2. **Preferred protocol for Git operations?** → `SSH`
3. **Upload your SSH public key?** → Skip (already done in Step 4)
4. **How would you like to authenticate?** → `Login with a web browser`

The browser option works even without a browser in the VM—it provides a URL and code you can open on your host machine or phone.

## Step 7: Verify Setup

Test SSH connection:

```bash
ssh -T github-personal
# Expected: "Hi <username>! You've successfully authenticated..."
```

Test GitHub CLI:

```bash
gh auth status
```

Test pushing:

```bash
cd /home/vagrant/code/<your-repo>
git push
```

## Troubleshooting

### "Could not resolve hostname"

Your SSH config `Host` doesn't match the remote URL. Check:

```bash
git remote -v
```

If it shows `git@github.com:...`, use `Host github.com` in your SSH config.
If it shows `github-personal:...`, use `Host github-personal`.

### "Permission denied (publickey)"

- Verify the public key is added to GitHub: https://github.com/settings/keys
- Check file permissions: `ls -la ~/.ssh/` (should be `700` for dir, `600` for files)
- Test with verbose output: `ssh -vT github-personal`

### Key persistence after `vagrant destroy`

SSH keys in `~/.ssh` are lost when you destroy the VM. Options:

1. **Re-run this setup** after each `vagrant up`
2. **Store keys in synced folder** at `/home/vagrant/code/bot-sandbox/.ssh/` and symlink (note: keys would be in your git repo, which may not be desirable)
3. **Accept ephemeral keys** and rotate them as needed

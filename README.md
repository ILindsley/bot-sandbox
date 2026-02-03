# Bot Sandbox

Isolated VM for running AI coding assistants (Claude Code, Cursor, etc.) with elevated permissions safely.

## Why?

Flags like `--dangerously-skip-permissions` let AI bots run without confirmation prompts, which is great for productivity but risky on your host machine. This VM provides isolation so bots can't accidentally damage your system.

## Setup

### Windows (VirtualBox)

```powershell
# Install prerequisites
winget install Oracle.VirtualBox
winget install Hashicorp.Vagrant

# Restart terminal, then:
cd ~/code/bot-sandbox
vagrant up
```

### macOS Apple Silicon (VMware Fusion)

```bash
brew install --cask vmware-fusion
brew install vagrant
vagrant plugin install vagrant-vmware-desktop

cd ~/code/bot-sandbox
vagrant up --provider=vmware_desktop
```

### macOS Intel (VirtualBox)

```bash
brew install --cask virtualbox vagrant
cd ~/code/bot-sandbox
vagrant up
```

## Usage

```bash
# Connect to the VM
vagrant ssh

# Navigate to any project (all ~/code siblings are mounted)
cd /home/vagrant/code/my-project

# Run your AI coding assistant
claude --dangerously-skip-permissions
```

## Multiple Sessions

Open multiple terminals and `vagrant ssh` into each. You can run separate bot sessions for different projects simultaneously.

## Typical Workflow

**Daily use:**

```bash
vagrant up          # Start VM (fast if already created)
vagrant ssh         # Work in VM
exit                # When done coding
vagrant halt        # Stop VM, preserves everything
```

**Next session:**

```bash
vagrant up          # Resumes quickly
vagrant ssh
```

Think of `halt` as "shut down my computer" (keeps everything) and `destroy` as "factory reset" (nukes everything).

## Commands

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `vagrant up`            | Start the VM                     |
| `vagrant ssh`           | SSH into the VM                  |
| `vagrant halt`          | Stop the VM                      |
| `vagrant destroy`       | Delete the VM entirely           |
| `vagrant provision`     | Re-run the provisioning script   |
| `vagrant reload`        | Restart VM with updated config   |
| `vagrant status`        | Show VM status (current project) |
| `vagrant global-status` | Show all VMs across all projects |

**Tip:** Use `vagrant global-status` to get VM IDs, then `vagrant ssh <id>` to connect from any directory without needing to `cd` to the project folder first.

**When to use reload vs destroy:**

- `vagrant reload` — Use after changing the Vagrantfile (e.g., synced folders, ports, memory). Keeps installed software and project state intact.
- `vagrant destroy && vagrant up` — Use for a clean slate. Deletes everything and re-provisions from scratch.

## What's Provisioned

- Ubuntu 24.04 LTS
- Node.js 22.x
- Claude Code (globally installed)
- Ports forwarded: 3000 (guest) => 3001 (host), 5173 (guest) => 5174 (host)

## Directory Structure

Your `~/code` directory is mounted at `/home/vagrant/code`:

```
/home/vagrant/code/
├── bot-sandbox/    # This repo (Vagrantfile)
├── project-a/
├── project-b/
└── ...
```

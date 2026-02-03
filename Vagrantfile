# -*- mode: ruby -*-
# vi: set ft=ruby :

# Claude Code sandbox VM
#
# Provides an isolated environment for running Claude Code with --dangerously-skip-permissions
# Mounts the parent ~/code directory so all sibling projects are accessible.
#
# Usage:
#   vagrant up              # Start the VM
#   vagrant ssh             # Connect to the VM
#   cd /home/vagrant/code/<project>
#   claude --dangerously-skip-permissions
#
# Windows (VirtualBox):  vagrant up
# Mac M-series (VMware): vagrant up --provider=vmware_desktop

Vagrant.configure("2") do |config|
  # Forward common dev ports (host => guest)
  config.vm.network "forwarded_port", guest: 3000, host: 3001
  config.vm.network "forwarded_port", guest: 5173, host: 5174

  # Disable default /vagrant mount
  config.vm.synced_folder ".", "/vagrant", disabled: true

  # Mount parent code directory (all sibling repos accessible)
  config.vm.synced_folder "..", "/home/vagrant/code"

  # --- VirtualBox (Windows / Intel Mac) ---
  config.vm.provider "virtualbox" do |vb, override|
    override.vm.box = "bento/ubuntu-24.04"
    vb.memory = 4096
    vb.cpus = 2
    vb.name = "claude-sandbox"
  end

  # --- VMware Fusion (Mac M-series) ---
  config.vm.provider "vmware_desktop" do |v, override|
    override.vm.box = "bento/ubuntu-24.04-arm64"
    v.vmx["memsize"] = "4096"
    v.vmx["numvcpus"] = "2"
    v.vmx["displayname"] = "claude-sandbox"
  end

  # Provisioning script - runs once on first `vagrant up`
  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    set -e

    # Install Node.js 22.x
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install Claude Code globally
    sudo npm install -g @anthropic-ai/claude-code

    echo ""
    echo "========================================="
    echo "Claude sandbox ready!"
    echo ""
    echo "  cd /home/vagrant/code/<project>"
    echo "  claude --dangerously-skip-permissions"
    echo "========================================="
  SHELL
end

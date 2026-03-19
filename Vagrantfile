# -*- mode: ruby -*-
# vi: set ft=ruby :

# Bot Sandbox VM
#
# Provides an isolated environment for running AI coding assistants
# (Claude Code, Cursor, etc.) with elevated permissions safely.
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
  # Increase boot timeout for systems with Hyper-V/Memory Integrity enabled
  # (VirtualBox falls back to slower NEM mode when AMD-V/VT-x is unavailable)
  config.vm.boot_timeout = 600

  # Forward common dev ports (host => guest)
  config.vm.network "forwarded_port", guest: 3000, host: 3001
  config.vm.network "forwarded_port", guest: 5173, host: 5174

  # Disable all shared folders (use git clone inside VM instead)
  config.vm.synced_folder ".", "/vagrant", disabled: true


  # --- VirtualBox (Windows / Intel Mac) ---
  config.vm.provider "virtualbox" do |vb, override|
    override.vm.box = "bento/ubuntu-24.04"
    vb.memory = 4096
    vb.cpus = 2
    vb.name = "bot-sandbox"
    # Use virtio NIC - more reliable under Hyper-V/NEM (when Memory Integrity is on)
    vb.default_nic_type = "virtio"
    # When Hyper-V is active, VirtualBox falls back to NEM. Using the "hyperv"
    # paravirt provider (instead of the default "kvm") avoids kernel crashes
    # caused by AMD SRSO mitigations that NEM doesn't properly support.
    vb.customize ["modifyvm", :id, "--paravirt-provider", "hyperv"]
    vb.customize ["modifyvm", :id, "--largepages", "off"]
  end

  # --- VMware Fusion (Mac M-series) ---
  config.vm.provider "vmware_desktop" do |v, override|
    override.vm.box = "bento/ubuntu-24.04-arm64"
    v.vmx["memsize"] = "4096"
    v.vmx["numvcpus"] = "2"
    v.vmx["displayname"] = "bot-sandbox"
  end

  # Provisioning script - runs once on first `vagrant up`
  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    set -e

    # Install Node.js 22.x
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install Claude Code (native installer - auto-updates, no Node.js dependency)
    curl -fsSL https://claude.ai/install.sh | bash

    echo ""
    echo "========================================="
    echo "Bot sandbox ready!"
    echo ""
    echo "  cd /home/vagrant/code/<project>"
    echo "  claude --dangerously-skip-permissions"
    echo "========================================="
  SHELL
end

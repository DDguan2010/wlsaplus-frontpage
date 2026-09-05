---
title: How to set up Phone control on Windows
date: 2026-09-05
summary: A complete beginner's guide to connecting an Android phone to WLSAPlus over Wi-Fi for video, sound, touch, and keyboard control.
author: WLSAPlus
---

Phone control lets you view and operate an Android phone from a Windows laptop. After a one-time USB setup, the phone can connect wirelessly while both devices are on the same Wi-Fi network.

You do not need to know Android development or networking. Follow each section in order and keep the phone unlocked during the first connection.

## What you need

- A Windows laptop with the WLSAPlus desktop app installed
- An Android phone
- A USB cable that supports data, not only charging
- The phone and laptop connected to the **same Wi-Fi network**

Phone control is not available in the WLSAPlus web version, Android app, or macOS version.

Sound forwarding normally requires Android 11 or newer. Video, touch, and keyboard control may still work on older Android versions without sound.

## Step 1: Enable Developer options

Android hides Developer options by default. The exact names can be different on Samsung, Xiaomi, Huawei, Honor, Oppo, Vivo, Google Pixel, and other phones.

The usual method is:

1. Open the phone's **Settings** app.
2. Open **About phone**.
3. Find **Build number** or **Software information**.
4. Tap **Build number** seven times.
5. Enter the phone's PIN or password if asked.
6. The phone should show a message such as "You are now a developer."

If you cannot find Build number, search Bing or Baidu for:

```text
how to enable developer options [your phone brand and model]
```

For example: `how to enable developer options Xiaomi 15`.

## Step 2: Enable USB debugging

1. Return to the main **Settings** page.
2. Open **System**, **Additional settings**, or **Developer options**. The location depends on the phone brand.
3. Open **Developer options**.
4. Find **USB debugging** and turn it on.
5. Accept the warning shown by Android.

Some phones have another setting named **USB debugging (Security settings)** or **Install via USB**. WLSAPlus normally needs only the main USB debugging option. If touch or keyboard control does not work on a Xiaomi or similar phone, enabling the security-related USB debugging option may help.

## Step 3: Put both devices on the same Wi-Fi

Connect the phone and laptop to the same Wi-Fi network before opening Phone control.

Using the same internet provider is not enough. For example, a phone using mobile data and a laptop using school Wi-Fi are not on the same local network. The Wi-Fi name shown on both devices should normally be the same.

Guest Wi-Fi and some managed networks prevent devices from talking to each other. If setup fails even when the Wi-Fi name matches, try a normal home Wi-Fi network or a personal hotspot.

## Step 4: Make the first USB connection

1. Unlock the phone and leave its screen on.
2. Connect the phone to the laptop with the USB cable.
3. If the phone asks what the USB connection should be used for, choose **File transfer** or **Transferring files**. This is helpful when a phone does not expose data access automatically.
4. Watch the phone screen for an **Allow USB debugging?** message.
5. Select **Always allow from this computer** if this is your own laptop.
6. Select **Allow**.

Do not approve USB debugging on a public or unknown computer. This permission allows the computer to control parts of the phone.

## Step 5: Connect from WLSAPlus

1. Open WLSAPlus on the laptop.
2. Select **Tools**.
3. Open **Phone control**.
4. Leave **Turn off the phone display** enabled if you want the physical phone screen to become black while the computer view stays active.
5. Select **Connect by USB**.
6. Keep the phone unlocked and connected by USB while WLSAPlus reads the phone information and enables wireless mode.
7. If the USB debugging message appears again, select **Allow**.
8. Wait for the phone window to open on the laptop.

After the phone window opens and WLSAPlus says the phone is connected, you can unplug the USB cable. The phone window should continue working over Wi-Fi.

Android 11 phones should remain unlocked while the phone window is starting so that audio capture can begin correctly.

## Using the phone from the laptop

- Click or drag with the mouse to touch and swipe.
- Type with the laptop keyboard when a text field is selected.
- Copy and paste text between the laptop and phone.
- Use the controls in WLSAPlus for **Back**, **Home**, **Recent apps**, volume, and power.
- Select **Close phone** when you want to close the mirrored phone window.

If **Turn off the phone display** was enabled, the real phone screen stays black to reduce distraction and power use. The mirrored view on the laptop remains visible. The phone is still running, not switched off.

## Reconnecting later without USB

As long as the phone has not restarted and is still on the same Wi-Fi:

1. Open **Tools > Phone control**.
2. Select **Open wirelessly**.
3. Keep the phone awake and wait for the phone window to open.

Android may disable the wireless debugging connection after the phone restarts, after Wi-Fi changes, or after Developer options are reset. If **Open wirelessly** stops working, select **Forget** and repeat the USB setup.

## Troubleshooting

### WLSAPlus keeps waiting for USB

- Confirm that USB debugging is enabled.
- Unlock the phone and look for the authorization message.
- Try another USB port.
- Try another cable. Many inexpensive cables can charge but cannot transfer data.
- Disconnect other Android phones from the laptop. WLSAPlus expects one USB phone during setup.

### The phone says USB debugging is unauthorized

Unlock the phone, select **Allow** on the debugging message, and try again. If no message appears, open Developer options, select **Revoke USB debugging authorizations**, reconnect the cable, and approve the new message.

### WLSAPlus cannot find a Wi-Fi address

Make sure Wi-Fi is turned on for the phone. Turn off mobile data temporarily if the phone keeps using it instead of Wi-Fi, then confirm that the phone and laptop show the same Wi-Fi name.

### The wireless connection fails

The Wi-Fi network may block communication between devices. Try a home network or personal hotspot. Also make sure the phone is awake and has not switched to another Wi-Fi network.

### The phone connects but there is no sound

Audio requires Android 11 or newer and may be blocked by individual apps. Unlock the phone before opening the phone window. Video and control can continue even when audio is unavailable.

### Touch or keyboard input does not work

Confirm that the phone still shows the connected computer as authorized in Developer options. Some phone brands also require their additional USB debugging security option.

## Turning the feature off

Select **Close phone** to stop mirroring. Select **Forget** in WLSAPlus if you no longer want it to remember the wireless phone connection.

You can also turn off USB debugging from Android Developer options when you no longer need Phone control. Repeat the setup steps whenever you want to use it again.

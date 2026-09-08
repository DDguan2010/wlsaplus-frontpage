---
title: How to set up Phone control on Windows
date: 2026-09-08
summary: Set up wireless Android phone control on Windows with WLSAPlus 1.0.7, including automatic Cloudflare fallback without an account.
author: WLSAPlus
---

Phone control lets you view and operate an Android phone from a Windows laptop, with sound, mouse, and keyboard support. Connect USB for setup, then unplug it once the phone window opens. WLSAPlus tries direct Wi-Fi first. If the devices cannot reach each other that way, it automatically uses a secure connection through Cloudflare. You do not need to choose a connection mode, create an account, or set up a server.

**Updated for WLSAPlus 1.0.7.** Install version 1.0.7 or newer on Windows and Android from the [WLSAPlus download page](/). Automatic Cloudflare fallback is included in 1.0.7; the setup below does not apply to older Tailscale test builds.

You do not need to know Android development or networking. Follow each section in order and keep the phone unlocked during the first connection.

## What you need

- A Windows laptop with the WLSAPlus desktop app installed
- An Android phone running Android 7 or newer, with the WLSAPlus Android app installed for secure fallback
- A USB cable that supports data, not only charging
- The phone and laptop connected to the **same Wi-Fi network** for the fastest direct connection
- For automatic fallback: working internet access on both devices

The **Windows app controls the phone**. The **Android app receives the connection**; it does not control another phone. This feature is not available in the web or macOS version, and iPhones are not supported.

The secure connection is built into WLSAPlus and uses the hosted WLSAPlus relay. No separate Cloudflare app or PowerSchool login is needed. You approve your own computer using a matching code during USB setup.

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

## Step 3: Connect both devices to Wi-Fi

For the fastest direct connection, connect the phone and laptop to the same Wi-Fi network before opening Phone control.

For direct Wi-Fi, the Wi-Fi name shown on both devices should normally be the same. A phone using mobile data and a laptop using Wi-Fi cannot connect directly this way, but the secure fallback can work if both can reach the relay over the internet. Relayed video uses internet data.

Guest Wi-Fi and some managed networks prevent devices from talking to each other, even when their Wi-Fi names match. Both devices can stay on that Wi-Fi and use the automatic Cloudflare fallback, provided the network allows access to the relay. You do not need to change the router or its Wi-Fi password.

Direct Wi-Fi usually has less delay. Cloudflare fallback can be slower or disconnect on unstable networks; it cannot guarantee a connection everywhere.

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
8. If WLSAPlus asks you to enable the Android connection and approve a code, follow the secure-connection steps below.
9. Wait for the phone window to open on the laptop.

After the phone window opens and WLSAPlus says **Phone is connected**, you can unplug the USB cable. The phone window should continue working wirelessly. If fallback is in use, the **Secure connection** section says **Connected through Cloudflare**.

Android 11 phones should remain unlocked while the phone window is starting so that audio capture can begin correctly.

## If WLSAPlus asks for a secure connection

This only appears when the direct Wi-Fi connection fails. Keep the USB cable connected throughout these steps.

1. WLSAPlus opens **Connect to computer** in the Android app. You can also open it yourself from the Android app's login screen or **Tools**; a PowerSchool login is not required.
2. On the phone, select **Enable connection**. If Android asks about notifications, allowing them makes the connection's **Stop** control easy to find.
3. When the phone says **Ready to pair**, select **Pair computer**.
4. Compare the six-digit code on the phone with the code shown in WLSAPlus on the laptop. If they match, select **Approve matching code**, then **Approve** in the confirmation. Never approve a code you did not request or one that does not match.
5. Wait until the actual phone window opens on Windows. Only then unplug USB.

The pairing window expires after three minutes. If setup times out, keep USB connected, select **Connect by USB** again on Windows, and reopen **Pair computer** on the phone if it appears. An interrupted setup can usually resume without forgetting the pair.

Only one computer is approved at a time, and the approved pairing is saved securely on both devices. Other people on the same Wi-Fi do not share that pairing. Phone-control traffic is encrypted between your devices; using this connection does not turn on the separate WLSAPlus VPN tool.

**Phone paired** means the approval has been saved. **Connected through Cloudflare** means the secure connection is available. Wait for **Phone is connected** and the visible phone window before treating setup as finished.

## Using the phone from the laptop

- Click or drag with the mouse to touch and swipe.
- Type with the laptop keyboard when a text field is selected.
- Copy and paste text between the laptop and phone.
- Use the controls in WLSAPlus for **Back**, **Home**, **Recent apps**, volume, and power.
- Select **Close phone** when you want to close the mirrored phone window.

If **Turn off the phone display** was enabled, the real phone screen stays black to reduce distraction and power use. The mirrored view on the laptop remains visible. The phone is still running, not switched off.

## Reconnecting later without USB

As long as the phone has not restarted and remains reachable:

1. For a paired connection, open **Connect to computer** on Android and select **Enable connection** if it is stopped.
2. Open the installed WLSAPlus app on Windows, then **Tools > Phone control**.
3. Select **Open wirelessly**.
4. Keep the phone unlocked while connecting and wait for the phone window to open.

Android may disable the debugging connection after the phone restarts or Developer options are reset. Reconnect the cable and select **Connect by USB** again; you normally do not need to forget the saved pair. If the connection fails to reopen, the USB button also appears beside the retry control.

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

Make sure Wi-Fi is turned on for the phone. In version 1.0.7, a missing direct Wi-Fi address starts the secure fallback instead. Keep USB connected during the first setup, install WLSAPlus on Android, and follow the matching-code steps above. Both devices still need internet access for the fallback.

### The wireless connection fails

The Wi-Fi network may block communication between devices. Leave USB connected and let WLSAPlus try its secure connection automatically. If that also fails, check that both devices have working internet access, both apps are version 1.0.7 or newer, and **Connect to computer** is enabled on Android. After a phone restart, repeat USB setup.

If the relay is blocked or unreachable, try another network if one is available. You do not need to create an account or change any server settings.

### The phone window closes with "Device disconnected" or "device offline"

A network interruption can close the phone window even if the secure connection reconnects afterward. Keep **Connect to computer** enabled on the phone and select **Open wirelessly** on Windows to open a new phone window. Seeing **Connected through Cloudflare** by itself does not mean the mirror is still open.

If it keeps failing, unlock the phone, reconnect the USB cable, and select **Connect by USB**. Check for a new USB debugging approval prompt. You normally do not need to forget the saved pairing. For less delay and fewer interruptions, use a Wi-Fi network that allows a direct connection when possible.

### The connection stops when the phone screen is off

Keep the WLSAPlus phone-connection notification active. In Android app battery settings, allow WLSAPlus to run in the background if your phone manufacturer stops it. This may use more battery. Reopen **Connect to computer** and enable it again after force-stopping the app.

### The phone connects but there is no sound

Audio requires Android 11 or newer and may be blocked by individual apps. Unlock the phone before opening the phone window. Video and control can continue even when audio is unavailable.

### Touch or keyboard input does not work

Confirm that the phone still shows the connected computer as authorized in Developer options. Some phone brands also require their additional USB debugging security option.

## Upgrading from an older version or test build

Install the latest Windows release, then use the **WLSAPlus desktop shortcut**. Normal use does not require an npm command. Close any Windows development or preview instance before opening the installed app's phone connection.

If an older Android installation refuses the 1.0.7 update, read the [1.0.7 release notes](https://github.com/DDguan2010/wlsaplus/releases/tag/v1.0.7) before removing anything. The Android signing key changed for this release, and uninstalling the old app clears its local data. Save any tasks or settings you need first.

**WLSAPlus Phone Preview** is a separate Android app. Its pairing is not automatically imported into the regular Android app. If you already have a working preview connection, keep it until you are ready to set up the regular app. To move to the regular Android app, stop the preview connection, select **Forget** on Windows, and repeat USB pairing with the regular app. Older Tailscale pairings also need a new USB approval for Cloudflare.

## Turning the feature off

Select **Close phone** to close the mirrored window. This does not revoke the computer's approval.

For a paired connection, select **Stop connection** in the Android app or **Stop** in its notification to close the secure connection. Select **Forget computer** on Android to revoke the approved computer immediately. Also select **Forget** on Windows to remove its saved pairing. Pair again by USB when changing computers or phones.

Turn off USB debugging from Android Developer options when you no longer need Phone control. USB setup enables Android's ADB network listener, so stopping the secure connection alone does not disable Android debugging. Never forward its debugging port through a router or approve unknown computers.

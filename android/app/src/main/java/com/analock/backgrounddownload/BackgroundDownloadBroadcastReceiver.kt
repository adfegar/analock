package com.analock.backgrounddownload

import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Promise

class BackgroundDownloadBroadcastReceiver(
    private var promise: Promise? = null,
    private var downloadManager: DownloadManager? = null,
    private var downloadId: Long? = null,
    private var filePath: String? = null
) : BroadcastReceiver() {

    companion object {
        private const val E_DOWNLOAD_FAILED = "E_DOWNLOAD_FAILED"
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        Log.d("BackgroundDownloadModule", "Download complete broadcast received")
        Log.d("BackgroundDownloadModule", "Expected File Path: $filePath")

        val id = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1)

        if (id == downloadId) {
            val query = downloadId?.let { DownloadManager.Query().setFilterById(it) }
            val cursor = downloadManager?.query(query)

            if (cursor != null && filePath != null) {
                if (cursor.moveToFirst()) {
                    val columnIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS)
                    val status = cursor.getInt(columnIndex)
                    when (status) {
                        DownloadManager.STATUS_SUCCESSFUL -> {
                            promise?.resolve(filePath)
                        }
                        DownloadManager.STATUS_FAILED -> {
                            Log.d("BackgroundDownloadModule", "Download failed(${cursor.getString(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS))})")
                            promise?.reject(E_DOWNLOAD_FAILED, "Download failed(${cursor.getString(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS))})")
                        }
                    }
                }
                cursor.close()
            }
            context?.unregisterReceiver(this)
        }
    }
}

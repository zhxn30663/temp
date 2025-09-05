/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useCallback, useEffect, useMemo } from "react";
import { DropdownGroup, DropdownItem } from "@patternfly/react-core/dist/js/components/Dropdown";
import DownloadIcon from "@patternfly/react-icons/dist/js/icons/download-icon";
import FolderIcon from "@patternfly/react-icons/dist/js/icons/folder-icon";
import ImageIcon from "@patternfly/react-icons/dist/js/icons/image-icon";
import { WorkspaceFile } from "@kie-tools-core/workspaces-git-fs/dist/context/WorkspacesContext";
import { useGlobalAlertsDispatchContext } from "../../../alerts";
import { ActiveWorkspace } from "@kie-tools-core/workspaces-git-fs/dist/model/ActiveWorkspace";
import { EmbeddedEditorRef } from "@kie-tools-core/editor/dist/embedded";
import { useEditorToolbarContext } from "../EditorToolbarContextProvider";

type Props = {
  workspaceFile: WorkspaceFile;
  workspace: ActiveWorkspace;
  editor: EmbeddedEditorRef | undefined;
};

export const DownloadDropdownGroup = (props: Props) => {
  const alertsDispatch = useGlobalAlertsDispatchContext();
  const { downloadRef, downloadAllRef, downloadPreviewRef, downloadWorkspaceZip } = useEditorToolbarContext();

  useEffect(() => {
    if (!props.workspaceFile) {
      return;
    }
    if (downloadRef.current) {
      downloadRef.current.download = `${props.workspaceFile.name}`;
    }
    if (downloadAllRef.current) {
      downloadAllRef.current.download = `${props.workspace.descriptor.name}.zip`;
    }
    if (downloadPreviewRef.current) {
      downloadPreviewRef.current.download = `${props.workspaceFile.name}.svg`;
    }
  }, [props.workspaceFile, props.workspace.descriptor, downloadRef, downloadAllRef, downloadPreviewRef]);

  const shouldIncludeDownloadSvgDropdownItem = useMemo(() => {
    return props.workspaceFile.extension.toLowerCase() !== "pmml";
  }, [props.workspaceFile]);

  const onDownload = useCallback(() => {
    props.editor?.getStateControl().setSavedCommand();
    alertsDispatch.closeAll();
    props.workspaceFile.getFileContents().then((content) => {
      if (downloadRef.current) {
        const fileBlob = new Blob([content], { type: "text/plain" });
        downloadRef.current.href = URL.createObjectURL(fileBlob);
        downloadRef.current.click();
      }
    });
  }, [props.editor, props.workspaceFile, alertsDispatch, downloadRef]);

  const downloadSvg = useCallback(() => {
    props.editor?.getPreview().then((previewSvg) => {
      if (downloadPreviewRef.current && previewSvg) {
        const fileBlob = new Blob([previewSvg], { type: "image/svg+xml" });
        downloadPreviewRef.current.href = URL.createObjectURL(fileBlob);
        downloadPreviewRef.current.click();
      }
    });
  }, [downloadPreviewRef, props.editor]);

  return (
    <DropdownGroup key={"download-group"} label="下载">
      <DropdownItem
        onClick={onDownload}
        key={"download-file-item"}
        description={`将下载 ${props.workspaceFile.name}`}
        icon={<DownloadIcon />}
        ouiaId="download-file-dropdown-button"
      >
        当前文件
      </DropdownItem>
      {shouldIncludeDownloadSvgDropdownItem && (
        <DropdownItem
          key={`dropdown-download-svg`}
          data-testid="dropdown-download-svg"
          component="button"
          onClick={downloadSvg}
          description={`将以 SVG 格式下载 ${props.workspaceFile.name} 的图像`}
          icon={<ImageIcon />}
        >
          {"当前文件的 SVG"}
        </DropdownItem>
      )}
      <DropdownItem
        onClick={downloadWorkspaceZip}
        key={"download-zip-item"}
        description={`将下载包含所有文件的 zip 文件`}
        icon={<FolderIcon />}
      >
        所有文件
      </DropdownItem>
    </DropdownGroup>
  );
};

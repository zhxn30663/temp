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

import * as React from "react";
import { useContext, useRef } from "react";

export interface Commands {
  hideFromDrd: () => void;
  toggleHierarchyHighlight: () => void;
  togglePropertiesPanel: () => void;
  createGroup: () => void;
  selectAll: () => void;
  paste: () => void;
  copy: () => void;
  cut: () => void;
  cancelAction: () => void;
  focusOnSelection: () => void;
  resetPosition: () => void;
}

const CommandsContext = React.createContext<{
  commandsRef: React.MutableRefObject<Commands>;
}>({} as any);

export function useCommands() {
  return useContext(CommandsContext);
}

export function CommandsContextProvider(props: React.PropsWithChildren<{}>) {
  const commandsRef = useRef<Commands>({
    hideFromDrd: () => {
      throw new Error("DMN 编辑器：hideFromDrd 命令未实现。");
    },
    toggleHierarchyHighlight: () => {
      throw new Error("DMN 编辑器：toggleHierarchyHighlight 命令未实现。");
    },
    togglePropertiesPanel: () => {
      throw new Error("DMN 编辑器：togglePropertiesPanel 命令未实现。");
    },
    createGroup: () => {
      throw new Error("DMN 编辑器：createGroup 命令未实现。");
    },
    selectAll: () => {
      throw new Error("DMN 编辑器：selectAll 命令未实现。");
    },
    paste: () => {
      throw new Error("DMN 编辑器：paste 命令未实现。");
    },
    copy: () => {
      throw new Error("DMN 编辑器：copy 命令未实现。");
    },
    cut: () => {
      throw new Error("DMN 编辑器：cut 命令未实现。");
    },
    cancelAction: () => {
      throw new Error("DMN 编辑器：cancelAction 命令未实现。");
    },
    focusOnSelection: () => {
      throw new Error("DMN 编辑器：focusOnSelection 命令未实现。");
    },
    resetPosition: () => {
      throw new Error("DMN 编辑器：resetPosition 命令未实现。");
    },
  });

  return <CommandsContext.Provider value={{ commandsRef }}>{props.children}</CommandsContext.Provider>;
}

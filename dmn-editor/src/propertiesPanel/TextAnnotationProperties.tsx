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
import { DMN15__tTextAnnotation } from "@kie-tools/dmn-marshaller/dist/schemas/dmn-1_5/ts-gen/types";
import { ClipboardCopy } from "@patternfly/react-core/dist/js/components/ClipboardCopy";
import { FormGroup } from "@patternfly/react-core/dist/js/components/Form";
import { TextArea } from "@patternfly/react-core/dist/js/components/TextArea";
import { TextInput } from "@patternfly/react-core/dist/js/components/TextInput";
import { useDmnEditorStoreApi } from "../store/StoreContext";
import { updateTextAnnotation } from "../mutations/renameNode";
import { Normalized } from "../normalization/normalize";

export function TextAnnotationProperties({
  textAnnotation,
  index,
}: {
  textAnnotation: Normalized<DMN15__tTextAnnotation>;
  index: number;
}) {
  const { setState } = useDmnEditorStoreApi();

  return (
    <>
      <FormGroup label="格式">
        <TextInput
          aria-label={"格式"}
          type={"text"}
          isDisabled={false}
          value={textAnnotation["@_textFormat"]}
          placeholder={"输入文本格式..."}
          onChange={(newTextFormat) => {
            setState((state) => {
              (state.dmn.model.definitions.artifact![index] as Normalized<DMN15__tTextAnnotation>)["@_textFormat"] =
                newTextFormat;
            });
          }}
        />
      </FormGroup>

      <FormGroup label="文本">
        <TextArea
          aria-label={"文本"}
          type={"text"}
          isDisabled={false}
          value={textAnnotation.text?.__$$text}
          onChange={(newText) => {
            setState((state) => {
              updateTextAnnotation({
                definitions: state.dmn.model.definitions,
                index,
                newText,
              });
            });
          }}
          placeholder={"输入文本..."}
          style={{ resize: "vertical", minHeight: "40px" }}
          rows={6}
        />
      </FormGroup>

      <FormGroup label="描述">
        <TextArea
          aria-label={"描述"}
          type={"text"}
          isDisabled={false}
          value={textAnnotation.description?.__$$text}
          onChange={(newDescription) => {
            setState((state) => {
              (state.dmn.model.definitions.artifact![index] as Normalized<DMN15__tTextAnnotation>).description = {
                __$$text: newDescription,
              };
            });
          }}
          placeholder={"输入描述..."}
          style={{ resize: "vertical", minHeight: "40px" }}
          rows={2}
        />
      </FormGroup>

      <FormGroup label="ID">
        <ClipboardCopy isReadOnly={true} hoverTip="Copy" clickTip="Copied">
          {textAnnotation["@_id"]}
        </ClipboardCopy>
      </FormGroup>
    </>
  );
}

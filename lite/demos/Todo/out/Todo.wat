(module
  ;; ── Types ───────────────────────────────────────────
  (type $AnyFn (sub (struct)))
  (type $WasmStr (array (mut i32)))
  (type $ListBase (sub (struct)))
  (type $StringBuilder (sub (struct (field (mut (ref $WasmStr))) (field (mut i32)) (field (mut i32)))))
  (type $FuncType_4 (func (param (ref $AnyFn))))
  (type $ClosureBase_5 (sub $AnyFn (struct (field (ref $FuncType_4)))))
  (type $ClosureType_6 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)))))
  (type $Browser_Elmish_Attr`1 (sub (struct (field i32))))
  (type $Browser_Elmish_Attr`1#0 (sub $Browser_Elmish_Attr`1 (struct (field i32) (field (ref $WasmStr)) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Attr`1#1 (sub $Browser_Elmish_Attr`1 (struct (field i32) (field i32))))
  (type $Browser_Elmish_Attr`1#2 (sub $Browser_Elmish_Attr`1 (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Attr`1#3 (sub $Browser_Elmish_Attr`1 (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Html`1 (sub (struct (field i32))))
  (type $Browser_Elmish_Html`1#0 (sub $Browser_Elmish_Html`1 (struct (field i32) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Html`1#1 (sub $Browser_Elmish_Html`1 (struct (field i32) (field (ref $WasmStr)) (field (ref null $ListBase)) (field (ref null $ListBase)))))
  (type $ListCons_15 (sub $ListBase (struct (field (ref $Browser_Elmish_Attr`1)) (field (mut (ref null $ListBase))))))
  (type $ListCons_16 (sub $ListBase (struct (field (ref $Browser_Elmish_Html`1)) (field (mut (ref null $ListBase))))))
  (type $Browser_Elmish_Program`2 (sub (struct (field i32) (field (ref $AnyFn)) (field (ref $AnyFn)) (field i32) (field i32) (field (ref $AnyFn)))))
  (type $FuncType_18 (func (param (ref $AnyFn)) (param (ref $WasmStr))))
  (type $ClosureBase_19 (sub $AnyFn (struct (field (ref $FuncType_18)))))
  (type $ClosureType_20 (sub $ClosureBase_19 (struct (field (ref $FuncType_18)))))
  (type $FuncType_21 (func (param (ref $AnyFn)) (param i32) (result (ref $AnyFn))))
  (type $ClosureBase_22 (sub $AnyFn (struct (field (ref $FuncType_21)))))
  (type $ClosureType_23 (sub $ClosureBase_22 (struct (field (ref $FuncType_21)))))
  (type $FuncType_24 (func (param (ref $AnyFn)) (param i32) (param (ref $WasmStr))))
  (type $ClosureBase_25 (sub $AnyFn (struct (field (ref $FuncType_24)))))
  (type $GcArray_26 (array (mut (ref null $AnyFn))))
  (type $ResizeArray_27 (sub (struct (field (mut (ref null $GcArray_26))) (field (mut i32)))))
  (type $FuncType_28 (func (param (ref $AnyFn)) (param (ref $WasmStr)) (param (ref $AnyFn))))
  (type $ClosureBase_29 (sub $AnyFn (struct (field (ref $FuncType_28)))))
  (type $ClosureType_30 (sub $ClosureBase_29 (struct (field (ref $FuncType_28)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $FuncType_31 (func (param (ref $AnyFn)) (param (ref $WasmStr)) (result i32)))
  (type $ClosureBase_32 (sub $AnyFn (struct (field (ref $FuncType_31)))))
  (type $ClosureType_33 (sub $ClosureBase_32 (struct (field (ref $FuncType_31)) (field i32))))
  (type $FuncType_34 (func (param (ref $AnyFn)) (param (ref $WasmStr)) (result (ref $AnyFn))))
  (type $ClosureBase_35 (sub $AnyFn (struct (field (ref $FuncType_34)))))
  (type $FuncType_36 (func (param (ref $AnyFn)) (param (ref $AnyFn))))
  (type $ClosureBase_37 (sub $AnyFn (struct (field (ref $FuncType_36)))))
  (type $GcArray_38 (array (mut (ref null $WasmStr))))
  (type $Option_39 (sub (struct (field i32))))
  (type $FuncType_40 (func (param (ref $AnyFn)) (param i32) (param i32) (result i32)))
  (type $ClosureBase_41 (sub $AnyFn (struct (field (ref $FuncType_40)))))
  (type $FuncType_42 (func (param (ref $AnyFn)) (param i32) (result i32)))
  (type $ClosureBase_43 (sub $AnyFn (struct (field (ref $FuncType_42)))))
  (type $ClosureType_44 (sub $ClosureBase_32 (struct (field (ref $FuncType_31)) (field (ref $AnyFn)))))
  (type $ClosureType_45 (sub $ClosureBase_29 (struct (field (ref $FuncType_28)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $ClosureType_46 (sub $ClosureBase_32 (struct (field (ref $FuncType_31)) (field i32))))
  (type $ClosureType_47 (sub $ClosureBase_32 (struct (field (ref $FuncType_31)) (field (ref $AnyFn)))))
  (type $FuncType_48 (func (param (ref $AnyFn)) (param (ref $Browser_Elmish_Attr`1))))
  (type $ClosureBase_49 (sub $AnyFn (struct (field (ref $FuncType_48)))))
  (type $ClosureType_50 (sub $ClosureBase_49 (struct (field (ref $FuncType_48)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $ClosureType_51 (sub $ClosureBase_49 (struct (field (ref $FuncType_48)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $FuncType_52 (func (param (ref $AnyFn)) (param (ref $Browser_Elmish_Html`1))))
  (type $ClosureBase_53 (sub $AnyFn (struct (field (ref $FuncType_52)))))
  (type $ClosureType_54 (sub $ClosureBase_53 (struct (field (ref $FuncType_52)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $ClosureType_55 (sub $ClosureBase_53 (struct (field (ref $FuncType_52)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $Browser_Elmish_Program`2<i32~i32> (sub (struct (field i32) (field (ref $AnyFn)) (field (ref $AnyFn)) (field i32) (field i32) (field (ref $AnyFn)))))
  (type $RefCell_57 (sub (struct (field (mut i32)))))
  (type $FuncType_58 (func (param (ref $AnyFn)) (param i32) (result (ref $Browser_Elmish_Html`1))))
  (type $ClosureBase_59 (sub $AnyFn (struct (field (ref $FuncType_58)))))
  (type $FuncType_60 (func (param (ref $AnyFn)) (param i32)))
  (type $ClosureBase_61 (sub $AnyFn (struct (field (ref $FuncType_60)))))
  (type $ClosureType_62 (sub $ClosureBase_19 (struct (field (ref $FuncType_18)) (field (ref $ResizeArray_27)) (field i32) (field (ref $RefCell_57)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  (type $ClosureType_63 (sub $ClosureBase_22 (struct (field (ref $FuncType_21)) (field (ref $ResizeArray_27)) (field (ref $RefCell_57)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  (type $ClosureType_64 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_57)) (field (ref $Browser_Elmish_Program`2<i32~i32>)))))
  (type $ClosureType_65 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_57)) (field (ref $Browser_Elmish_Program`2<i32~i32>)) (field (ref $AnyFn)))))
  (type $ClosureType_66 (sub $ClosureBase_61 (struct (field (ref $FuncType_60)))))
  (type $Browser_Elmish_Html`1<i32> (sub (struct (field i32))))
  (type $Browser_Elmish_Html`1<i32>#0 (sub $Browser_Elmish_Html`1<i32> (struct (field i32) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Html`1<i32>#1 (sub $Browser_Elmish_Html`1<i32> (struct (field i32) (field (ref $WasmStr)) (field (ref null $ListBase)) (field (ref null $ListBase)))))
  (type $ListCons_70 (sub $ListBase (struct (field (ref $Browser_Elmish_Html`1<i32>)) (field (mut (ref null $ListBase))))))
  (type $Browser_Elmish_Attr`1<i32> (sub (struct (field i32))))
  (type $Browser_Elmish_Attr`1<i32>#0 (sub $Browser_Elmish_Attr`1<i32> (struct (field i32) (field (ref $WasmStr)) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Attr`1<i32>#1 (sub $Browser_Elmish_Attr`1<i32> (struct (field i32) (field i32))))
  (type $Browser_Elmish_Attr`1<i32>#2 (sub $Browser_Elmish_Attr`1<i32> (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Attr`1<i32>#3 (sub $Browser_Elmish_Attr`1<i32> (struct (field i32) (field (ref $AnyFn)))))
  (type $Todo_Item (sub (struct (field i32) (field (ref $WasmStr)) (field i32))))
  (type $Todo_Model (sub (struct (field (ref null $ListBase)) (field (ref $WasmStr)) (field i32))))
  (type $ListCons_78 (sub $ListBase (struct (field (ref $Todo_Item)) (field (mut (ref null $ListBase))))))
  (type $Todo_Msg (sub (struct (field i32))))
  (type $Todo_Msg#0 (sub $Todo_Msg (struct (field i32) (field (ref $WasmStr)))))
  (type $Todo_Msg#1 (sub $Todo_Msg (struct (field i32))))
  (type $Todo_Msg#2 (sub $Todo_Msg (struct (field i32) (field i32))))
  (type $Todo_Msg#3 (sub $Todo_Msg (struct (field i32) (field i32))))
  (type $Todo_Msg#4 (sub $Todo_Msg (struct (field i32))))
  (type $FuncType_85 (func (param (ref $AnyFn)) (param (ref $Todo_Item)) (result (ref $Todo_Item))))
  (type $ClosureBase_86 (sub $AnyFn (struct (field (ref $FuncType_85)))))
  (type $ClosureType_87 (sub $ClosureBase_86 (struct (field (ref $FuncType_85)) (field i32))))
  (type $FuncType_88 (func (param (ref $AnyFn)) (param (ref $Todo_Item)) (result i32)))
  (type $ClosureBase_89 (sub $AnyFn (struct (field (ref $FuncType_88)))))
  (type $ClosureType_90 (sub $ClosureBase_89 (struct (field (ref $FuncType_88)) (field i32))))
  (type $ClosureType_91 (sub $ClosureBase_89 (struct (field (ref $FuncType_88)))))
  (type $Browser_Elmish_Attr`1<ref79> (sub (struct (field i32))))
  (type $Browser_Elmish_Attr`1<ref79>#0 (sub $Browser_Elmish_Attr`1<ref79> (struct (field i32) (field (ref $WasmStr)) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Attr`1<ref79>#1 (sub $Browser_Elmish_Attr`1<ref79> (struct (field i32) (field (ref $Todo_Msg)))))
  (type $Browser_Elmish_Attr`1<ref79>#2 (sub $Browser_Elmish_Attr`1<ref79> (struct (field i32) (field (ref $AnyFn)))))
  (type $Browser_Elmish_Attr`1<ref79>#3 (sub $Browser_Elmish_Attr`1<ref79> (struct (field i32) (field (ref $AnyFn)))))
  (type $ListCons_97 (sub $ListBase (struct (field (ref $Browser_Elmish_Attr`1<ref79>)) (field (mut (ref null $ListBase))))))
  (type $Browser_Elmish_Html`1<ref79> (sub (struct (field i32))))
  (type $Browser_Elmish_Html`1<ref79>#0 (sub $Browser_Elmish_Html`1<ref79> (struct (field i32) (field (ref $WasmStr)))))
  (type $Browser_Elmish_Html`1<ref79>#1 (sub $Browser_Elmish_Html`1<ref79> (struct (field i32) (field (ref $WasmStr)) (field (ref null $ListBase)) (field (ref null $ListBase)))))
  (type $ListCons_101 (sub $ListBase (struct (field (ref $Browser_Elmish_Html`1<ref79>)) (field (mut (ref null $ListBase))))))
  (type $FuncType_102 (func (param (ref $AnyFn)) (param (ref $WasmStr)) (result (ref $Todo_Msg))))
  (type $ClosureBase_103 (sub $AnyFn (struct (field (ref $FuncType_102)))))
  (type $ClosureType_104 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_105 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_106 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_107 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_108 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_109 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_110 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_111 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $FuncType_112 (func (param (ref $AnyFn)) (param (ref $Todo_Item)) (result (ref $Browser_Elmish_Html`1<ref79>))))
  (type $ClosureBase_113 (sub $AnyFn (struct (field (ref $FuncType_112)))))
  (type $ClosureType_114 (sub $ClosureBase_113 (struct (field (ref $FuncType_112)))))
  (type $ClosureType_115 (sub $ClosureBase_113 (struct (field (ref $FuncType_112)))))
  (type $ClosureType_116 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_117 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_118 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_119 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_120 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_121 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_122 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_123 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)))))
  (type $ClosureType_124 (sub $ClosureBase_113 (struct (field (ref $FuncType_112)))))
  (type $ClosureType_125 (sub $ClosureBase_113 (struct (field (ref $FuncType_112)))))
  (type $Browser_Elmish_Program`2<ref77~ref79> (sub (struct (field (ref $Todo_Model)) (field (ref $AnyFn)) (field (ref $AnyFn)) (field i32) (field (ref $Todo_Msg)) (field (ref $AnyFn)))))
  (type $FuncType_127 (func (param (ref $AnyFn)) (param (ref $Todo_Model)) (result (ref $Todo_Model))))
  (type $ClosureBase_128 (sub $AnyFn (struct (field (ref $FuncType_127)))))
  (type $ClosureType_129 (sub $ClosureBase_128 (struct (field (ref $FuncType_127)) (field (ref $Todo_Msg)))))
  (type $FuncType_130 (func (param (ref $AnyFn)) (param (ref $Todo_Msg)) (result (ref $AnyFn))))
  (type $ClosureBase_131 (sub $AnyFn (struct (field (ref $FuncType_130)))))
  (type $ClosureType_132 (sub $ClosureBase_131 (struct (field (ref $FuncType_130)))))
  (type $FuncType_133 (func (param (ref $AnyFn)) (param (ref $Todo_Model)) (result (ref $Browser_Elmish_Html`1<ref79>))))
  (type $ClosureBase_134 (sub $AnyFn (struct (field (ref $FuncType_133)))))
  (type $ClosureType_135 (sub $ClosureBase_134 (struct (field (ref $FuncType_133)))))
  (type $ClosureType_136 (sub $ClosureBase_128 (struct (field (ref $FuncType_127)) (field (ref $Todo_Msg)))))
  (type $ClosureType_137 (sub $ClosureBase_131 (struct (field (ref $FuncType_130)))))
  (type $ClosureType_138 (sub $ClosureBase_134 (struct (field (ref $FuncType_133)))))
  (type $FuncType_139 (func (param (ref $AnyFn)) (param (ref $Todo_Model))))
  (type $ClosureBase_140 (sub $AnyFn (struct (field (ref $FuncType_139)))))
  (type $ClosureType_141 (sub $ClosureBase_140 (struct (field (ref $FuncType_139)))))
  (type $ClosureType_142 (sub $ClosureBase_128 (struct (field (ref $FuncType_127)) (field (ref $Todo_Msg)))))
  (type $ClosureType_143 (sub $ClosureBase_131 (struct (field (ref $FuncType_130)))))
  (type $ClosureType_144 (sub $ClosureBase_134 (struct (field (ref $FuncType_133)))))
  (type $ClosureType_145 (sub $ClosureBase_128 (struct (field (ref $FuncType_127)) (field (ref $Todo_Msg)))))
  (type $ClosureType_146 (sub $ClosureBase_131 (struct (field (ref $FuncType_130)))))
  (type $ClosureType_147 (sub $ClosureBase_134 (struct (field (ref $FuncType_133)))))
  (type $RefCell_148 (sub (struct (field (mut (ref $Todo_Model))))))
  (type $ClosureType_149 (sub $ClosureBase_29 (struct (field (ref $FuncType_28)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $ClosureType_150 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)) (field (ref $Todo_Msg)))))
  (type $FuncType_151 (func (param (ref $AnyFn)) (param i32) (param i32) (result (ref $Todo_Msg))))
  (type $ClosureBase_152 (sub $AnyFn (struct (field (ref $FuncType_151)))))
  (type $FuncType_153 (func (param (ref $AnyFn)) (param i32) (result (ref $Todo_Msg))))
  (type $ClosureBase_154 (sub $AnyFn (struct (field (ref $FuncType_153)))))
  (type $ClosureType_155 (sub $ClosureBase_103 (struct (field (ref $FuncType_102)) (field (ref $AnyFn)))))
  (type $FuncType_156 (func (param (ref $AnyFn)) (param (ref $Browser_Elmish_Attr`1<ref79>))))
  (type $ClosureBase_157 (sub $AnyFn (struct (field (ref $FuncType_156)))))
  (type $ClosureType_158 (sub $ClosureBase_157 (struct (field (ref $FuncType_156)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $FuncType_159 (func (param (ref $AnyFn)) (param (ref $Browser_Elmish_Html`1<ref79>))))
  (type $ClosureBase_160 (sub $AnyFn (struct (field (ref $FuncType_159)))))
  (type $ClosureType_161 (sub $ClosureBase_160 (struct (field (ref $FuncType_159)) (field (ref $ResizeArray_27)) (field (ref $StringBuilder)))))
  (type $FuncType_162 (func (param (ref $AnyFn)) (param (ref $Todo_Msg)) (param (ref $Todo_Model)) (result (ref $Todo_Model))))
  (type $ClosureBase_163 (sub $AnyFn (struct (field (ref $FuncType_162)))))
  (type $ClosureType_164 (sub $ClosureBase_19 (struct (field (ref $FuncType_18)) (field (ref $ResizeArray_27)) (field i32) (field (ref $RefCell_148)) (field (ref $Browser_Elmish_Program`2<ref77~ref79>)) (field (ref $AnyFn)))))
  (type $ClosureType_165 (sub $ClosureBase_22 (struct (field (ref $FuncType_21)) (field (ref $ResizeArray_27)) (field (ref $RefCell_148)) (field (ref $Browser_Elmish_Program`2<ref77~ref79>)) (field (ref $AnyFn)))))
  (type $ClosureType_166 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_148)) (field (ref $Browser_Elmish_Program`2<ref77~ref79>)))))
  (type $ClosureType_167 (sub $ClosureBase_5 (struct (field (ref $FuncType_4)) (field (ref $RefCell_148)) (field (ref $Browser_Elmish_Program`2<ref77~ref79>)) (field (ref $AnyFn)))))
  ;; ── Imports ────────────────────────────────────────
  (import "browser" "commit" (func $browser_commit (param i32)))
  (import "timing" "setInterval" (func $timing_setInterval (param i32) (result i32)))
  (import "browser" "putc" (func $browser_putc (param i32)))
  (import "env" "consolePrint" (func $consolePrint (param (ref $WasmStr))))
  ;; ── Tags (exception handling) ──────────────────────
  (tag $fsharp_exn)
  ;; ── Functions ──────────────────────────────────────
  (func $strConcat (param $a (ref $WasmStr)) (param $b (ref $WasmStr)) (result (ref $WasmStr))
    (local $la i32)
    (local $lb i32)
    (local $res (ref $WasmStr))
    local.get $a
    array.len
    local.set $la
    local.get $b
    array.len
    local.set $lb
    i32.const 0
    local.get $la
    local.get $lb
    i32.add
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $a
    i32.const 0
    local.get $la
    array.copy $WasmStr $WasmStr
    local.get $res
    local.get $la
    local.get $b
    i32.const 0
    local.get $lb
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $strEq (param $a (ref $WasmStr)) (param $b (ref $WasmStr)) (result i32)
    (local $la i32)
    (local $lb i32)
    (local $i i32)
    local.get $a
    array.len
    local.set $la
    local.get $b
    array.len
    local.set $lb
    local.get $la
    local.get $lb
    i32.ne
    if (result i32)
      i32.const 0
    else
      i32.const 0
      local.set $i
      block $q_wl_1_exit
        loop $q_wl_1
          local.get $i
          local.get $la
          i32.lt_s
          if (result i32)
            local.get $a
            local.get $i
            array.get $WasmStr
            local.get $b
            local.get $i
            array.get $WasmStr
            i32.eq
          else
            i32.const 0
          end
          if
            local.get $i
            i32.const 1
            i32.add
            local.set $i
            br $q_wl_1
          else
            br $q_wl_1_exit
          end
        end
      end
      local.get $i
      local.get $la
      i32.eq
      if (result i32)
        i32.const 1
      else
        i32.const 0
      end
    end
  )
  (func $strIndexOf (param $strIdx_ha (ref $WasmStr)) (param $strIdx_ne (ref $WasmStr)) (result i32)
    (local $w166 i32)
    (local $w167 i32)
    (local $w168 i32)
    (local $w169 i32)
    local.get $strIdx_ha
    array.len
    local.set $w166
    local.get $strIdx_ne
    array.len
    local.set $w167
    block $strIdx_165_outer (result i32)
      local.get $w167
      i32.const 0
      i32.eq
      if
        i32.const 0
        br $strIdx_165_outer
      end
      i32.const 0
      local.set $w168
      block $while_171_exit
        loop $while_171_lp
          local.get $w168
          local.get $w166
          local.get $w167
          i32.sub
          i32.le_s
          if
            block $strIdx_165_match
              i32.const 0
              local.set $w169
              block $while_170_exit
                loop $while_170_lp
                  local.get $w169
                  local.get $w167
                  i32.lt_s
                  if
                    local.get $strIdx_ha
                    local.get $w168
                    local.get $w169
                    i32.add
                    array.get $WasmStr
                    local.get $strIdx_ne
                    local.get $w169
                    array.get $WasmStr
                    i32.ne
                    if
                      br $strIdx_165_match
                    end
                    local.get $w169
                    i32.const 1
                    i32.add
                    local.set $w169
                    br $while_170_lp
                  else
                    br $while_170_exit
                  end
                end
              end
              local.get $w168
              br $strIdx_165_outer
            end
            local.get $w168
            i32.const 1
            i32.add
            local.set $w168
            br $while_171_lp
          else
            br $while_171_exit
          end
        end
      end
      i32.const -1
    end
  )
  (func $strLastIndexOf (param $ha (ref $WasmStr)) (param $ne (ref $WasmStr)) (result i32)
    (local $la i32)
    (local $lb i32)
    (local $result i32)
    (local $i i32)
    (local $j i32)
    local.get $ha
    array.len
    local.set $la
    local.get $ne
    array.len
    local.set $lb
    local.get $lb
    i32.const 0
    i32.eq
    if (result i32)
      local.get $la
    else
      i32.const -1
      local.set $result
      local.get $la
      local.get $lb
      i32.sub
      local.set $i
      block $q_wl_1_exit
        loop $q_wl_1
          local.get $result
          i32.const -1
          i32.eq
          if (result i32)
            local.get $i
            i32.const 0
            i32.ge_s
          else
            i32.const 0
          end
          if
            i32.const 0
            local.set $j
            block $q_wl_2_exit
              loop $q_wl_2
                local.get $j
                local.get $lb
                i32.lt_s
                if (result i32)
                  local.get $ha
                  local.get $i
                  local.get $j
                  i32.add
                  array.get $WasmStr
                  local.get $ne
                  local.get $j
                  array.get $WasmStr
                  i32.eq
                else
                  i32.const 0
                end
                if
                  local.get $j
                  i32.const 1
                  i32.add
                  local.set $j
                  br $q_wl_2
                else
                  br $q_wl_2_exit
                end
              end
            end
            local.get $j
            local.get $lb
            i32.ge_s
            if
              local.get $i
              local.set $result
            end
            local.get $i
            i32.const 1
            i32.sub
            local.set $i
            br $q_wl_1
          else
            br $q_wl_1_exit
          end
        end
      end
      local.get $result
    end
  )
  (func $strSubstring (param $src (ref $WasmStr)) (param $start i32) (param $len i32) (result (ref $WasmStr))
    (local $res (ref $WasmStr))
    i32.const 0
    local.get $len
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $src
    local.get $start
    local.get $len
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $strTrim (param $src (ref $WasmStr)) (result (ref $WasmStr))
    (local $len i32)
    (local $s i32)
    (local $e i32)
    (local $resLen i32)
    (local $res (ref $WasmStr))
    local.get $src
    array.len
    local.set $len
    i32.const 0
    local.set $s
    local.get $len
    local.set $e
    block $q_wl_1_exit
      loop $q_wl_1
        local.get $s
        local.get $len
        i32.lt_s
        if (result i32)
          local.get $src
          local.get $s
          array.get $WasmStr
          i32.const 32
          i32.le_s
        else
          i32.const 0
        end
        if
          local.get $s
          i32.const 1
          i32.add
          local.set $s
          br $q_wl_1
        else
          br $q_wl_1_exit
        end
      end
    end
    block $q_wl_2_exit
      loop $q_wl_2
        local.get $e
        local.get $s
        i32.gt_s
        if (result i32)
          local.get $src
          local.get $e
          i32.const 1
          i32.sub
          array.get $WasmStr
          i32.const 32
          i32.le_s
        else
          i32.const 0
        end
        if
          local.get $e
          i32.const 1
          i32.sub
          local.set $e
          br $q_wl_2
        else
          br $q_wl_2_exit
        end
      end
    end
    local.get $e
    local.get $s
    i32.sub
    local.set $resLen
    i32.const 0
    local.get $resLen
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $src
    local.get $s
    local.get $resLen
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $strTrimStart (param $src (ref $WasmStr)) (result (ref $WasmStr))
    (local $len i32)
    (local $s i32)
    (local $res (ref $WasmStr))
    local.get $src
    array.len
    local.set $len
    i32.const 0
    local.set $s
    block $q_wl_1_exit
      loop $q_wl_1
        local.get $s
        local.get $len
        i32.lt_s
        if (result i32)
          local.get $src
          local.get $s
          array.get $WasmStr
          i32.const 32
          i32.le_s
        else
          i32.const 0
        end
        if
          local.get $s
          i32.const 1
          i32.add
          local.set $s
          br $q_wl_1
        else
          br $q_wl_1_exit
        end
      end
    end
    i32.const 0
    local.get $len
    local.get $s
    i32.sub
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $src
    local.get $s
    local.get $len
    local.get $s
    i32.sub
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $strTrimEnd (param $src (ref $WasmStr)) (result (ref $WasmStr))
    (local $len i32)
    (local $e i32)
    (local $res (ref $WasmStr))
    local.get $src
    array.len
    local.set $len
    local.get $len
    local.set $e
    block $q_wl_1_exit
      loop $q_wl_1
        local.get $e
        i32.const 0
        i32.gt_s
        if (result i32)
          local.get $src
          local.get $e
          i32.const 1
          i32.sub
          array.get $WasmStr
          i32.const 32
          i32.le_s
        else
          i32.const 0
        end
        if
          local.get $e
          i32.const 1
          i32.sub
          local.set $e
          br $q_wl_1
        else
          br $q_wl_1_exit
        end
      end
    end
    i32.const 0
    local.get $e
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $src
    i32.const 0
    local.get $e
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $strReplace (param $src (ref $WasmStr)) (param $frm (ref $WasmStr)) (param $repl (ref $WasmStr)) (result (ref $WasmStr))
    (local $lo i32)
    (local $la i32)
    (local $pos i32)
    (local $acc (ref $WasmStr))
    (local $more i32)
    (local $j i32)
    local.get $frm
    array.len
    local.set $lo
    local.get $lo
    i32.const 0
    i32.eq
    if (result (ref $WasmStr))
      local.get $src
    else
      local.get $src
      array.len
      local.set $la
      i32.const 0
      local.set $pos
      i32.const 0
      i32.const 0
      array.new $WasmStr
      local.set $acc
      i32.const 1
      local.set $more
      block $q_wl_1_exit
        loop $q_wl_1
          local.get $more
          i32.const 1
          i32.eq
          if
            local.get $src
            local.get $pos
            local.get $la
            local.get $pos
            i32.sub
            call $strSubstring
            local.get $frm
            call $strIndexOf
            local.set $j
            local.get $j
            i32.const 0
            i32.lt_s
            if
              i32.const 0
              local.set $more
            else
              local.get $acc
              local.get $src
              local.get $pos
              local.get $j
              call $strSubstring
              call $strConcat
              local.get $repl
              call $strConcat
              local.set $acc
              local.get $pos
              local.get $j
              i32.add
              local.get $lo
              i32.add
              local.set $pos
            end
            br $q_wl_1
          else
            br $q_wl_1_exit
          end
        end
      end
      local.get $acc
      local.get $src
      local.get $pos
      local.get $la
      local.get $pos
      i32.sub
      call $strSubstring
      call $strConcat
    end
  )
  (func $strSplit (param $ssp_src (ref $WasmStr)) (param $ssp_del (ref $WasmStr)) (result (ref $GcArray_38))
    (local $ssp_dl i32)
    (local $ssp_pos i32)
    (local $ssp_cnt i32)
    (local $ssp_j i32)
    (local $ssp_arr (ref $GcArray_38))
    (local $ssp_pos_1 i32)
    (local $ssp_idx i32)
    (local $ssp_j_1 i32)
    local.get $ssp_del
    array.len
    local.set $ssp_dl
    local.get $ssp_dl
    i32.const 0
    i32.eq
    if (result (ref $GcArray_38))
      local.get $ssp_src
      array.new_fixed $GcArray_38 1
    else
      i32.const 0
      local.set $ssp_pos
      i32.const 1
      local.set $ssp_cnt
      block $ssp_cnt_done
        loop $ssp_cnt_loop
          local.get $ssp_src
          local.get $ssp_pos
          local.get $ssp_src
          array.len
          local.get $ssp_pos
          i32.sub
          call $strSubstring
          local.get $ssp_del
          call $strIndexOf
          local.set $ssp_j
          local.get $ssp_j
          i32.const 0
          i32.lt_s
          if
            br $ssp_cnt_done
          else
            local.get $ssp_cnt
            i32.const 1
            i32.add
            local.set $ssp_cnt
            local.get $ssp_pos
            local.get $ssp_j
            local.get $ssp_dl
            i32.add
            i32.add
            local.set $ssp_pos
            br $ssp_cnt_loop
          end
        end
      end
      array.new_fixed $WasmStr 0
      local.get $ssp_cnt
      array.new $GcArray_38
      local.set $ssp_arr
      i32.const 0
      local.set $ssp_pos_1
      i32.const 0
      local.set $ssp_idx
      block $ssp_fill_done
        loop $ssp_fill_loop
          local.get $ssp_src
          local.get $ssp_pos_1
          local.get $ssp_src
          array.len
          local.get $ssp_pos_1
          i32.sub
          call $strSubstring
          local.get $ssp_del
          call $strIndexOf
          local.set $ssp_j_1
          local.get $ssp_j_1
          i32.const 0
          i32.lt_s
          if
            br $ssp_fill_done
          else
            local.get $ssp_arr
            local.get $ssp_idx
            local.get $ssp_src
            local.get $ssp_pos_1
            local.get $ssp_j_1
            call $strSubstring
            array.set $GcArray_38
            local.get $ssp_idx
            i32.const 1
            i32.add
            local.set $ssp_idx
            local.get $ssp_pos_1
            local.get $ssp_j_1
            local.get $ssp_dl
            i32.add
            i32.add
            local.set $ssp_pos_1
            br $ssp_fill_loop
          end
        end
      end
      local.get $ssp_arr
      local.get $ssp_idx
      local.get $ssp_src
      local.get $ssp_pos_1
      local.get $ssp_src
      array.len
      local.get $ssp_pos_1
      i32.sub
      call $strSubstring
      array.set $GcArray_38
      local.get $ssp_arr
    end
  )
  (func $intToStr (param $n i32) (result (ref $WasmStr))
    (local $s (ref $WasmStr))
    (local $neg i32)
    (local $v i32)
    (local $buf (ref $WasmStr))
    (local $len i32)
    (local $res (ref $WasmStr))
    (local $i i32)
    (local $r2 (ref $WasmStr))
    local.get $n
    i32.const 0
    i32.eq
    if (result (ref $WasmStr))
      i32.const 48
      i32.const 1
      array.new $WasmStr
    else
      local.get $n
      i32.const -2147483648
      i32.eq
      if (result (ref $WasmStr))
        i32.const 0
        i32.const 11
        array.new $WasmStr
        local.set $s
        local.get $s
        i32.const 0
        i32.const 45
        array.set $WasmStr
        local.get $s
        i32.const 1
        i32.const 50
        array.set $WasmStr
        local.get $s
        i32.const 2
        i32.const 49
        array.set $WasmStr
        local.get $s
        i32.const 3
        i32.const 52
        array.set $WasmStr
        local.get $s
        i32.const 4
        i32.const 55
        array.set $WasmStr
        local.get $s
        i32.const 5
        i32.const 52
        array.set $WasmStr
        local.get $s
        i32.const 6
        i32.const 56
        array.set $WasmStr
        local.get $s
        i32.const 7
        i32.const 51
        array.set $WasmStr
        local.get $s
        i32.const 8
        i32.const 54
        array.set $WasmStr
        local.get $s
        i32.const 9
        i32.const 52
        array.set $WasmStr
        local.get $s
        i32.const 10
        i32.const 56
        array.set $WasmStr
        local.get $s
      else
        i32.const 0
        local.set $neg
        local.get $n
        local.set $v
        local.get $n
        i32.const 0
        i32.lt_s
        if
          i32.const 1
          local.set $neg
          i32.const 0
          local.get $n
          i32.sub
          local.set $v
        end
        i32.const 0
        i32.const 12
        array.new $WasmStr
        local.set $buf
        i32.const 0
        local.set $len
        block $q_wl_1_exit
          loop $q_wl_1
            local.get $v
            i32.const 0
            i32.ne
            if
              local.get $buf
              local.get $len
              local.get $v
              i32.const 10
              i32.rem_s
              i32.const 48
              i32.add
              array.set $WasmStr
              local.get $v
              i32.const 10
              i32.div_s
              local.set $v
              local.get $len
              i32.const 1
              i32.add
              local.set $len
              br $q_wl_1
            else
              br $q_wl_1_exit
            end
          end
        end
        i32.const 0
        local.get $len
        array.new $WasmStr
        local.set $res
        i32.const 0
        local.set $i
        block $q_fl_2_exit
          loop $q_fl_2
            local.get $i
            local.get $len
            i32.const 1
            i32.sub
            i32.le_s
            if
              local.get $res
              local.get $i
              local.get $buf
              local.get $len
              local.get $i
              i32.sub
              i32.const 1
              i32.sub
              array.get $WasmStr
              array.set $WasmStr
              local.get $i
              i32.const 1
              i32.add
              local.set $i
              br $q_fl_2
            else
              br $q_fl_2_exit
            end
          end
        end
        local.get $neg
        i32.const 0
        i32.ne
        if (result (ref $WasmStr))
          i32.const 0
          local.get $len
          i32.const 1
          i32.add
          array.new $WasmStr
          local.set $r2
          local.get $r2
          i32.const 0
          i32.const 45
          array.set $WasmStr
          local.get $r2
          i32.const 1
          local.get $res
          i32.const 0
          local.get $len
          array.copy $WasmStr $WasmStr
          local.get $r2
        else
          local.get $res
        end
      end
    end
  )
  (func $parseInt (param $s (ref $WasmStr)) (result i32)
    (local $len i32)
    (local $i i32)
    (local $neg i32)
    (local $acc i32)
    (local $valid i32)
    (local $ch i32)
    local.get $s
    array.len
    local.set $len
    local.get $len
    i32.const 0
    i32.eq
    if (result i32)
      i32.const 0
    else
      i32.const 0
      local.set $i
      i32.const 0
      local.set $neg
      i32.const 0
      local.set $acc
      i32.const 1
      local.set $valid
      local.get $s
      i32.const 0
      array.get $WasmStr
      i32.const 45
      i32.eq
      if
        i32.const 1
        local.set $neg
        i32.const 1
        local.set $i
      end
      block $q_wl_1_exit
        loop $q_wl_1
          local.get $valid
          i32.const 1
          i32.eq
          if (result i32)
            local.get $i
            local.get $len
            i32.lt_s
          else
            i32.const 0
          end
          if
            local.get $s
            local.get $i
            array.get $WasmStr
            local.set $ch
            local.get $ch
            i32.const 48
            i32.lt_s
            if (result i32)
              i32.const 1
            else
              local.get $ch
              i32.const 57
              i32.gt_s
            end
            if
              i32.const 0
              local.set $valid
            else
              local.get $acc
              i32.const 10
              i32.mul
              local.get $ch
              i32.add
              i32.const 48
              i32.sub
              local.set $acc
              local.get $i
              i32.const 1
              i32.add
              local.set $i
            end
            br $q_wl_1
          else
            br $q_wl_1_exit
          end
        end
      end
      local.get $valid
      i32.const 0
      i32.eq
      if (result i32)
        i32.const 0
      else
        local.get $neg
        i32.const 0
        i32.ne
        if (result i32)
          i32.const 0
          local.get $acc
          i32.sub
        else
          local.get $acc
        end
      end
    end
  )
  (func $sbCreate (param $cap i32) (result (ref $StringBuilder))
    i32.const 0
    local.get $cap
    array.new $WasmStr
    i32.const 0
    local.get $cap
    struct.new $StringBuilder
  )
  (func $sbAppend (param $sb (ref $StringBuilder)) (param $s (ref $WasmStr)) (result (ref $StringBuilder))
    (local $oldLen i32)
    (local $sLen i32)
    (local $newLen i32)
    (local $cap i32)
    (local $doubleCap i32)
    (local $newCap i32)
    (local $newBuf (ref $WasmStr))
    local.get $sb
    struct.get $StringBuilder 1
    local.set $oldLen
    local.get $s
    array.len
    local.set $sLen
    local.get $oldLen
    local.get $sLen
    i32.add
    local.set $newLen
    local.get $sb
    struct.get $StringBuilder 2
    local.set $cap
    local.get $newLen
    local.get $cap
    i32.gt_s
    if
      local.get $cap
      i32.const 1
      i32.shl
      local.set $doubleCap
      local.get $doubleCap
      local.get $newLen
      i32.gt_s
      if (result i32)
        local.get $doubleCap
      else
        local.get $newLen
      end
      local.set $newCap
      i32.const 0
      local.get $newCap
      array.new $WasmStr
      local.set $newBuf
      local.get $newBuf
      i32.const 0
      local.get $sb
      struct.get $StringBuilder 0
      i32.const 0
      local.get $oldLen
      array.copy $WasmStr $WasmStr
      local.get $sb
      local.get $newBuf
      struct.set $StringBuilder 0
      local.get $sb
      local.get $newCap
      struct.set $StringBuilder 2
    end
    local.get $sb
    struct.get $StringBuilder 0
    local.get $oldLen
    local.get $s
    i32.const 0
    local.get $sLen
    array.copy $WasmStr $WasmStr
    local.get $sb
    local.get $newLen
    struct.set $StringBuilder 1
    local.get $sb
  )
  (func $sbToString (param $sb (ref $StringBuilder)) (result (ref $WasmStr))
    (local $len i32)
    (local $res (ref $WasmStr))
    local.get $sb
    struct.get $StringBuilder 1
    local.set $len
    i32.const 0
    local.get $len
    array.new $WasmStr
    local.set $res
    local.get $res
    i32.const 0
    local.get $sb
    struct.get $StringBuilder 0
    i32.const 0
    local.get $len
    array.copy $WasmStr $WasmStr
    local.get $res
  )
  (func $closure_1 (param $self (ref $AnyFn))
  )
  (func $tickSlot$init (result (ref $AnyFn))
    ref.func $closure_1
    struct.new $ClosureType_6
  )
  (func $tick ;; exported as "tick"
    (local $lo_clo_1 (ref $ClosureBase_5))
    global.get $tickSlot
    ref.cast (ref $AnyFn)
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_1
    local.get $lo_clo_1
    local.get $lo_clo_1
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
  )
  (func $every (param $ms i32) (param $f (ref $AnyFn)) (result i32) ;; exported as "every"
    local.get $f
    global.set $tickSlot
    local.get $ms
    return_call $timing_setInterval
  )
  (func $send (param $target i32) (param $s (ref $WasmStr)) ;; exported as "send"
    (local $i i32)
    (local $limit i32)
    i32.const 0
    local.set $i
    local.get $s
    array.len
    i32.const 1
    i32.sub
    local.set $limit
    loop $for
      local.get $i
      local.get $limit
      i32.le_s
      if
        local.get $s
        local.get $i
        array.get $WasmStr
        i32.const -1
        i32.xor
        i32.const -1
        i32.xor
        call $browser_putc
        local.get $i
        i32.const 1
        i32.add
        local.set $i
        br $for
      end
    end
    local.get $target
    call $browser_commit
  )
  (func $inbox$init (result (ref $WasmStr))
    array.new_fixed $WasmStr 0
  )
  (func $inboxClear ;; exported as "inboxClear"
    array.new_fixed $WasmStr 0
    global.set $inbox
  )
  (func $inboxPut (param $c i32) ;; exported as "inboxPut"
    global.get $inbox
    ref.cast (ref $WasmStr)
    local.get $c
    i32.const 65535
    i32.and
    array.new_fixed $WasmStr 1
    call $strConcat
    global.set $inbox
  )
  (func $inboxText (result (ref $WasmStr)) ;; exported as "inboxText"
    global.get $inbox
    ref.cast (ref $WasmStr)
  )
  (func $escape (param $s (ref $WasmStr)) (result (ref $WasmStr)) ;; exported as "escape"
    local.get $s
    i32.const 38
    array.new_fixed $WasmStr 1
    i32.const 38
    i32.const 97
    i32.const 109
    i32.const 112
    i32.const 59
    array.new_fixed $WasmStr 5
    call $strReplace
    i32.const 60
    array.new_fixed $WasmStr 1
    i32.const 38
    i32.const 108
    i32.const 116
    i32.const 59
    array.new_fixed $WasmStr 4
    call $strReplace
    i32.const 62
    array.new_fixed $WasmStr 1
    i32.const 38
    i32.const 103
    i32.const 116
    i32.const 59
    array.new_fixed $WasmStr 4
    call $strReplace
    i32.const 34
    array.new_fixed $WasmStr 1
    i32.const 38
    i32.const 113
    i32.const 117
    i32.const 111
    i32.const 116
    i32.const 59
    array.new_fixed $WasmStr 6
    call $strReplace
  )
  (func $closure_3 (param $self (ref $AnyFn)) (param $_arg_1 (ref $WasmStr))
  )
  (func $closure_2 (param $self (ref $AnyFn)) (param $_arg i32) (result (ref $AnyFn))
    ref.func $closure_3
    struct.new $ClosureType_20
  )
  (func $handlerSlot$init (result (ref $AnyFn))
    ref.func $closure_2
    struct.new $ClosureType_23
  )
  (func $dispatch (param $id i32) ;; exported as "dispatch"
    (local $ap_clo_4 (ref $AnyFn))
    (local $ap_arg_4_1 (ref $WasmStr))
    (local $lo_clo_2 (ref $ClosureBase_25))
    (local $lo_clo_4 (ref $ClosureBase_19))
    (local $lo_clo_3 (ref $ClosureBase_22))
    global.get $handlerSlot
    ref.cast (ref $AnyFn)
    local.set $ap_clo_4
    call $inboxText
    local.set $ap_arg_4_1
    local.get $ap_clo_4
    ref.test (ref $ClosureBase_25)
    if
      local.get $ap_clo_4
      ref.cast (ref $ClosureBase_25)
      local.set $lo_clo_2
      local.get $lo_clo_2
      local.get $id
      local.get $ap_arg_4_1
      local.get $lo_clo_2
      struct.get $ClosureBase_25 0
      call_ref $FuncType_24
    else
      local.get $ap_clo_4
      ref.cast (ref $ClosureBase_22)
      local.set $lo_clo_3
      local.get $lo_clo_3
      local.get $id
      local.get $lo_clo_3
      struct.get $ClosureBase_22 0
      call_ref $FuncType_21
      ref.cast (ref $ClosureBase_19)
      local.set $lo_clo_4
      local.get $lo_clo_4
      local.get $ap_arg_4_1
      local.get $lo_clo_4
      struct.get $ClosureBase_19 0
      call_ref $FuncType_18
    end
  )
  (func $init (result (ref $Todo_Model)) ;; exported as "init"
    i32.const 1
    i32.const 67
    i32.const 111
    i32.const 109
    i32.const 112
    i32.const 105
    i32.const 108
    i32.const 101
    i32.const 32
    i32.const 70
    i32.const 35
    i32.const 32
    i32.const 116
    i32.const 111
    i32.const 32
    i32.const 87
    i32.const 97
    i32.const 115
    i32.const 109
    i32.const 71
    i32.const 67
    array.new_fixed $WasmStr 20
    i32.const 1
    struct.new $Todo_Item
    i32.const 2
    i32.const 82
    i32.const 117
    i32.const 110
    i32.const 32
    i32.const 105
    i32.const 116
    i32.const 32
    i32.const 105
    i32.const 110
    i32.const 32
    i32.const 97
    i32.const 32
    i32.const 98
    i32.const 114
    i32.const 111
    i32.const 119
    i32.const 115
    i32.const 101
    i32.const 114
    array.new_fixed $WasmStr 19
    i32.const 1
    struct.new $Todo_Item
    i32.const 3
    i32.const 70
    i32.const 105
    i32.const 110
    i32.const 100
    i32.const 32
    i32.const 115
    i32.const 112
    i32.const 111
    i32.const 110
    i32.const 115
    i32.const 111
    i32.const 114
    i32.const 115
    array.new_fixed $WasmStr 13
    i32.const 0
    struct.new $Todo_Item
    ref.null $ListBase
    struct.new $ListCons_78
    struct.new $ListCons_78
    struct.new $ListCons_78
    array.new_fixed $WasmStr 0
    i32.const 4
    struct.new $Todo_Model
  )
  (func $update (param $msg (ref $Todo_Msg)) (param $m (ref $Todo_Model)) (result (ref $Todo_Model)) ;; exported as "update"
    (local $title (ref $WasmStr))
    (local $w27 (ref null $ListBase))
    (local $w24 (ref null $ListBase))
    (local $w25 (ref null $ListBase))
    (local $w28 (ref null $ListBase))
    (local $id i32)
    (local $list (ref null $ListBase))
    (local $w34 (ref null $ListBase))
    (local $w31 (ref null $ListBase))
    (local $w32 (ref null $ListBase))
    (local $i (ref $Todo_Item))
    (local $Done i32)
    (local $w35 (ref null $ListBase))
    (local $w36 (ref null $ListBase))
    (local $id_1 i32)
    (local $list_1 (ref null $ListBase))
    (local $w42 (ref null $ListBase))
    (local $w39 (ref null $ListBase))
    (local $w40 (ref null $ListBase))
    (local $i_1 (ref $Todo_Item))
    (local $w43 (ref null $ListBase))
    (local $w44 (ref null $ListBase))
    (local $list_2 (ref null $ListBase))
    (local $w50 (ref null $ListBase))
    (local $w47 (ref null $ListBase))
    (local $w48 (ref null $ListBase))
    (local $i_2 (ref $Todo_Item))
    (local $w51 (ref null $ListBase))
    (local $w52 (ref null $ListBase))
    (local $s (ref $WasmStr))
    local.get $msg
    struct.get $Todo_Msg 0
    i32.const 1
    i32.eq
    if (result (ref $Todo_Model))
      local.get $m
      struct.get $Todo_Model 1
      call $strTrim
      local.set $title
      local.get $title
      array.new_fixed $WasmStr 0
      call $strEq
      if (result (ref $Todo_Model))
        local.get $m
      else
        local.get $m
        struct.get $Todo_Model 0
        local.set $w24
        ref.null $ListBase
        local.set $w25
        block $while_26_exit
          loop $while_26_lp
            local.get $w24
            ref.is_null
            i32.eqz
            if
              local.get $w24
              ref.cast (ref $ListCons_78)
              struct.get $ListCons_78 0
              local.get $w25
              struct.new $ListCons_78
              local.set $w25
              local.get $w24
              ref.cast (ref $ListCons_78)
              struct.get $ListCons_78 1
              local.set $w24
              br $while_26_lp
            else
              br $while_26_exit
            end
          end
        end
        local.get $w25
        local.set $w27
        local.get $m
        struct.get $Todo_Model 2
        local.get $title
        i32.const 0
        struct.new $Todo_Item
        ref.null $ListBase
        struct.new $ListCons_78
        local.set $w28
        block $while_29_exit
          loop $while_29_lp
            local.get $w27
            ref.is_null
            i32.eqz
            if
              local.get $w27
              ref.cast (ref $ListCons_78)
              struct.get $ListCons_78 0
              local.get $w28
              struct.new $ListCons_78
              local.set $w28
              local.get $w27
              ref.cast (ref $ListCons_78)
              struct.get $ListCons_78 1
              local.set $w27
              br $while_29_lp
            else
              br $while_29_exit
            end
          end
        end
        local.get $w28
        array.new_fixed $WasmStr 0
        local.get $m
        struct.get $Todo_Model 2
        i32.const 1
        i32.add
        struct.new $Todo_Model
      end
    else
      local.get $msg
      struct.get $Todo_Msg 0
      i32.const 2
      i32.eq
      if (result (ref $Todo_Model))
        local.get $msg
        ref.cast (ref $Todo_Msg#2)
        struct.get $Todo_Msg#2 1
        local.set $id
        local.get $m
        struct.get $Todo_Model 0
        local.set $list
        local.get $list
        local.set $w31
        ref.null $ListBase
        local.set $w32
        block $while_33_exit
          loop $while_33_lp
            local.get $w31
            ref.is_null
            i32.eqz
            if
              local.get $w31
              ref.cast (ref $ListCons_78)
              struct.get $ListCons_78 0
              local.set $i
              local.get $i
              struct.get $Todo_Item 0
              local.get $id
              i32.eq
              if (result (ref $Todo_Item))
                local.get $i
                struct.get $Todo_Item 2
                i32.eqz
                local.set $Done
                local.get $i
                struct.get $Todo_Item 0
                local.get $i
                struct.get $Todo_Item 1
                local.get $Done
                struct.new $Todo_Item
              else
                local.get $i
              end
              local.get $w32
              struct.new $ListCons_78
              local.set $w32
              local.get $w31
              ref.cast (ref $ListCons_78)
              struct.get $ListCons_78 1
              local.set $w31
              br $while_33_lp
            else
              br $while_33_exit
            end
          end
        end
        local.get $w32
        local.set $w34
        ref.null $ListBase
        local.set $w35
        block $while_37_exit
          loop $while_37_lp
            local.get $w34
            ref.is_null
            i32.eqz
            if
              local.get $w34
              ref.cast (ref $ListCons_78)
              struct.get $ListCons_78 1
              local.set $w36
              local.get $w34
              ref.cast (ref $ListCons_78)
              local.get $w35
              struct.set $ListCons_78 1
              local.get $w34
              local.set $w35
              local.get $w36
              local.set $w34
              br $while_37_lp
            else
              br $while_37_exit
            end
          end
        end
        local.get $w35
        local.get $m
        struct.get $Todo_Model 1
        local.get $m
        struct.get $Todo_Model 2
        struct.new $Todo_Model
      else
        local.get $msg
        struct.get $Todo_Msg 0
        i32.const 3
        i32.eq
        if (result (ref $Todo_Model))
          local.get $msg
          ref.cast (ref $Todo_Msg#3)
          struct.get $Todo_Msg#3 1
          local.set $id_1
          local.get $m
          struct.get $Todo_Model 0
          local.set $list_1
          local.get $list_1
          local.set $w39
          ref.null $ListBase
          local.set $w40
          block $while_41_exit
            loop $while_41_lp
              local.get $w39
              ref.is_null
              i32.eqz
              if
                local.get $w39
                ref.cast (ref $ListCons_78)
                struct.get $ListCons_78 0
                local.set $i_1
                local.get $i_1
                struct.get $Todo_Item 0
                local.get $id_1
                i32.ne
                if (result (ref null $ListBase))
                  local.get $w39
                  ref.cast (ref $ListCons_78)
                  struct.get $ListCons_78 0
                  local.get $w40
                  struct.new $ListCons_78
                else
                  local.get $w40
                end
                local.set $w40
                local.get $w39
                ref.cast (ref $ListCons_78)
                struct.get $ListCons_78 1
                local.set $w39
                br $while_41_lp
              else
                br $while_41_exit
              end
            end
          end
          local.get $w40
          local.set $w42
          ref.null $ListBase
          local.set $w43
          block $while_45_exit
            loop $while_45_lp
              local.get $w42
              ref.is_null
              i32.eqz
              if
                local.get $w42
                ref.cast (ref $ListCons_78)
                struct.get $ListCons_78 1
                local.set $w44
                local.get $w42
                ref.cast (ref $ListCons_78)
                local.get $w43
                struct.set $ListCons_78 1
                local.get $w42
                local.set $w43
                local.get $w44
                local.set $w42
                br $while_45_lp
              else
                br $while_45_exit
              end
            end
          end
          local.get $w43
          local.get $m
          struct.get $Todo_Model 1
          local.get $m
          struct.get $Todo_Model 2
          struct.new $Todo_Model
        else
          local.get $msg
          struct.get $Todo_Msg 0
          i32.const 4
          i32.eq
          if (result (ref $Todo_Model))
            local.get $m
            struct.get $Todo_Model 0
            local.set $list_2
            local.get $list_2
            local.set $w47
            ref.null $ListBase
            local.set $w48
            block $while_49_exit
              loop $while_49_lp
                local.get $w47
                ref.is_null
                i32.eqz
                if
                  local.get $w47
                  ref.cast (ref $ListCons_78)
                  struct.get $ListCons_78 0
                  local.set $i_2
                  local.get $i_2
                  struct.get $Todo_Item 2
                  i32.eqz
                  if (result (ref null $ListBase))
                    local.get $w47
                    ref.cast (ref $ListCons_78)
                    struct.get $ListCons_78 0
                    local.get $w48
                    struct.new $ListCons_78
                  else
                    local.get $w48
                  end
                  local.set $w48
                  local.get $w47
                  ref.cast (ref $ListCons_78)
                  struct.get $ListCons_78 1
                  local.set $w47
                  br $while_49_lp
                else
                  br $while_49_exit
                end
              end
            end
            local.get $w48
            local.set $w50
            ref.null $ListBase
            local.set $w51
            block $while_53_exit
              loop $while_53_lp
                local.get $w50
                ref.is_null
                i32.eqz
                if
                  local.get $w50
                  ref.cast (ref $ListCons_78)
                  struct.get $ListCons_78 1
                  local.set $w52
                  local.get $w50
                  ref.cast (ref $ListCons_78)
                  local.get $w51
                  struct.set $ListCons_78 1
                  local.get $w50
                  local.set $w51
                  local.get $w52
                  local.set $w50
                  br $while_53_lp
                else
                  br $while_53_exit
                end
              end
            end
            local.get $w51
            local.get $m
            struct.get $Todo_Model 1
            local.get $m
            struct.get $Todo_Model 2
            struct.new $Todo_Model
          else
            local.get $msg
            ref.cast (ref $Todo_Msg#0)
            struct.get $Todo_Msg#0 1
            local.set $s
            local.get $m
            struct.get $Todo_Model 0
            local.get $s
            local.get $m
            struct.get $Todo_Model 2
            struct.new $Todo_Model
          end
        end
      end
    end
  )
  (func $attr_ref79 (param $name (ref $WasmStr)) (param $value (ref $WasmStr)) (result (ref $Browser_Elmish_Attr`1))
    i32.const 0
    local.get $name
    local.get $value
    struct.new $Browser_Elmish_Attr`1<ref79>#0
  )
  (func $onClick_ref79 (param $msg (ref $Todo_Msg)) (result (ref $Browser_Elmish_Attr`1<ref79>))
    i32.const 1
    local.get $msg
    struct.new $Browser_Elmish_Attr`1<ref79>#1
  )
  (func $el_ref79 (param $tag (ref $WasmStr)) (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1))
    i32.const 1
    local.get $tag
    local.get $attrs
    local.get $children
    struct.new $Browser_Elmish_Html`1<ref79>#1
  )
  (func $input_ref79 (param $attrs (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1))
    i32.const 105
    i32.const 110
    i32.const 112
    i32.const 117
    i32.const 116
    array.new_fixed $WasmStr 5
    local.get $attrs
    ref.null $ListBase
    call $el_ref79
  )
  (func $text_ref79 (param $s (ref $WasmStr)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 0
    local.get $s
    struct.new $Browser_Elmish_Html`1<ref79>#0
  )
  (func $span_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 115
    i32.const 112
    i32.const 97
    i32.const 110
    array.new_fixed $WasmStr 4
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $label_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 108
    i32.const 97
    i32.const 98
    i32.const 101
    i32.const 108
    array.new_fixed $WasmStr 5
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $class$0027_ref79 (param $name (ref $WasmStr)) (result (ref $Browser_Elmish_Attr`1<ref79>))
    i32.const 0
    i32.const 99
    i32.const 108
    i32.const 97
    i32.const 115
    i32.const 115
    array.new_fixed $WasmStr 5
    local.get $name
    struct.new $Browser_Elmish_Attr`1<ref79>#0
  )
  (func $button_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 98
    i32.const 117
    i32.const 116
    i32.const 116
    i32.const 111
    i32.const 110
    array.new_fixed $WasmStr 6
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $li_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 108
    i32.const 105
    array.new_fixed $WasmStr 2
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $viewItem (param $i (ref $Todo_Item)) (result (ref $Browser_Elmish_Html`1<ref79>)) ;; exported as "viewItem"
    i32.const 115
    i32.const 116
    i32.const 121
    i32.const 108
    i32.const 101
    array.new_fixed $WasmStr 5
    i32.const 100
    i32.const 105
    i32.const 115
    i32.const 112
    i32.const 108
    i32.const 97
    i32.const 121
    i32.const 58
    i32.const 102
    i32.const 108
    i32.const 101
    i32.const 120
    i32.const 59
    i32.const 97
    i32.const 108
    i32.const 105
    i32.const 103
    i32.const 110
    i32.const 45
    i32.const 105
    i32.const 116
    i32.const 101
    i32.const 109
    i32.const 115
    i32.const 58
    i32.const 99
    i32.const 101
    i32.const 110
    i32.const 116
    i32.const 101
    i32.const 114
    i32.const 59
    i32.const 106
    i32.const 117
    i32.const 115
    i32.const 116
    i32.const 105
    i32.const 102
    i32.const 121
    i32.const 45
    i32.const 99
    i32.const 111
    i32.const 110
    i32.const 116
    i32.const 101
    i32.const 110
    i32.const 116
    i32.const 58
    i32.const 115
    i32.const 112
    i32.const 97
    i32.const 99
    i32.const 101
    i32.const 45
    i32.const 98
    i32.const 101
    i32.const 116
    i32.const 119
    i32.const 101
    i32.const 101
    i32.const 110
    array.new_fixed $WasmStr 61
    call $attr_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    ref.null $ListBase
    i32.const 116
    i32.const 121
    i32.const 112
    i32.const 101
    array.new_fixed $WasmStr 4
    i32.const 99
    i32.const 104
    i32.const 101
    i32.const 99
    i32.const 107
    i32.const 98
    i32.const 111
    i32.const 120
    array.new_fixed $WasmStr 8
    call $attr_ref79
    local.get $i
    struct.get $Todo_Item 2
    if (result (ref $WasmStr))
      i32.const 99
      i32.const 104
      i32.const 101
      i32.const 99
      i32.const 107
      i32.const 101
      i32.const 100
      array.new_fixed $WasmStr 7
    else
      i32.const 100
      i32.const 97
      i32.const 116
      i32.const 97
      i32.const 45
      i32.const 111
      i32.const 112
      i32.const 101
      i32.const 110
      array.new_fixed $WasmStr 9
    end
    i32.const 99
    i32.const 104
    i32.const 101
    i32.const 99
    i32.const 107
    i32.const 101
    i32.const 100
    array.new_fixed $WasmStr 7
    call $attr_ref79
    i32.const 2
    local.get $i
    struct.get $Todo_Item 0
    struct.new $Todo_Msg#2
    call $onClick_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    struct.new $ListCons_97
    struct.new $ListCons_97
    call $input_ref79
    i32.const 115
    i32.const 116
    i32.const 121
    i32.const 108
    i32.const 101
    array.new_fixed $WasmStr 5
    local.get $i
    struct.get $Todo_Item 2
    if (result (ref $WasmStr))
      i32.const 116
      i32.const 101
      i32.const 120
      i32.const 116
      i32.const 45
      i32.const 100
      i32.const 101
      i32.const 99
      i32.const 111
      i32.const 114
      i32.const 97
      i32.const 116
      i32.const 105
      i32.const 111
      i32.const 110
      i32.const 58
      i32.const 32
      i32.const 108
      i32.const 105
      i32.const 110
      i32.const 101
      i32.const 45
      i32.const 116
      i32.const 104
      i32.const 114
      i32.const 111
      i32.const 117
      i32.const 103
      i32.const 104
      i32.const 59
      i32.const 32
      i32.const 111
      i32.const 112
      i32.const 97
      i32.const 99
      i32.const 105
      i32.const 116
      i32.const 121
      i32.const 58
      i32.const 32
      i32.const 46
      i32.const 54
      array.new_fixed $WasmStr 42
    else
      array.new_fixed $WasmStr 0
    end
    call $attr_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    local.get $i
    struct.get $Todo_Item 1
    call $text_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    call $span_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    struct.new $ListCons_101
    call $label_ref79
    i32.const 111
    i32.const 117
    i32.const 116
    i32.const 108
    i32.const 105
    i32.const 110
    i32.const 101
    i32.const 32
    i32.const 115
    i32.const 101
    i32.const 99
    i32.const 111
    i32.const 110
    i32.const 100
    i32.const 97
    i32.const 114
    i32.const 121
    array.new_fixed $WasmStr 17
    call $class$0027_ref79
    i32.const 115
    i32.const 116
    i32.const 121
    i32.const 108
    i32.const 101
    array.new_fixed $WasmStr 5
    i32.const 112
    i32.const 97
    i32.const 100
    i32.const 100
    i32.const 105
    i32.const 110
    i32.const 103
    i32.const 58
    i32.const 46
    i32.const 49
    i32.const 114
    i32.const 101
    i32.const 109
    i32.const 32
    i32.const 46
    i32.const 54
    i32.const 114
    i32.const 101
    i32.const 109
    i32.const 59
    i32.const 109
    i32.const 97
    i32.const 114
    i32.const 103
    i32.const 105
    i32.const 110
    i32.const 45
    i32.const 108
    i32.const 101
    i32.const 102
    i32.const 116
    i32.const 58
    i32.const 46
    i32.const 53
    i32.const 114
    i32.const 101
    i32.const 109
    array.new_fixed $WasmStr 37
    call $attr_ref79
    i32.const 3
    local.get $i
    struct.get $Todo_Item 0
    struct.new $Todo_Msg#3
    call $onClick_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    struct.new $ListCons_97
    struct.new $ListCons_97
    i32.const 215
    array.new_fixed $WasmStr 1
    call $text_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    call $button_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    struct.new $ListCons_101
    return_call $li_ref79
  )
  (func $h2_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 104
    i32.const 50
    array.new_fixed $WasmStr 2
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $placeholder_ref79 (param $v (ref $WasmStr)) (result (ref $Browser_Elmish_Attr`1<ref79>))
    i32.const 0
    i32.const 112
    i32.const 108
    i32.const 97
    i32.const 99
    i32.const 101
    i32.const 104
    i32.const 111
    i32.const 108
    i32.const 100
    i32.const 101
    i32.const 114
    array.new_fixed $WasmStr 11
    local.get $v
    struct.new $Browser_Elmish_Attr`1<ref79>#0
  )
  (func $value$0027_ref79 (param $v (ref $WasmStr)) (result (ref $Browser_Elmish_Attr`1<ref79>))
    i32.const 0
    i32.const 118
    i32.const 97
    i32.const 108
    i32.const 117
    i32.const 101
    array.new_fixed $WasmStr 5
    local.get $v
    struct.new $Browser_Elmish_Attr`1<ref79>#0
  )
  (func $onInput_ref79 (param $f (ref $AnyFn)) (result (ref $Browser_Elmish_Attr`1<ref79>))
    i32.const 2
    local.get $f
    struct.new $Browser_Elmish_Attr`1<ref79>#2
  )
  (func $div_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 100
    i32.const 105
    i32.const 118
    array.new_fixed $WasmStr 3
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $ul_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 117
    i32.const 108
    array.new_fixed $WasmStr 2
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $small_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 115
    i32.const 109
    i32.const 97
    i32.const 108
    i32.const 108
    array.new_fixed $WasmStr 5
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $p_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 112
    array.new_fixed $WasmStr 1
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $closure_51 (param $self (ref $AnyFn)) (param $Item_1 (ref $WasmStr)) (result (ref $Todo_Msg))
    i32.const 0
    local.get $Item_1
    struct.new $Todo_Msg#0
  )
  (func $article_ref79 (param $attrs (ref null $ListBase)) (param $children (ref null $ListBase)) (result (ref $Browser_Elmish_Html`1<ref79>))
    i32.const 97
    i32.const 114
    i32.const 116
    i32.const 105
    i32.const 99
    i32.const 108
    i32.const 101
    array.new_fixed $WasmStr 7
    local.get $attrs
    local.get $children
    call $el_ref79
  )
  (func $view (param $m (ref $Todo_Model)) (result (ref $Browser_Elmish_Html`1<ref79>)) ;; exported as "view"
    (local $list (ref null $ListBase))
    (local $open$0027 i32)
    (local $w54 i32)
    (local $w56 (ref null $ListBase))
    (local $i (ref $Todo_Item))
    (local $list_2 (ref null $ListBase))
    (local $w118 (ref null $ListBase))
    (local $w115 (ref null $ListBase))
    (local $w116 (ref null $ListBase))
    (local $i_1 (ref $Todo_Item))
    (local $w119 (ref null $ListBase))
    (local $w120 (ref null $ListBase))
    (local $w151 (ref null $ListBase))
    (local $w152 i32)
    local.get $m
    struct.get $Todo_Model 0
    local.set $list
    i32.const 0
    local.set $w54
    local.get $list
    local.set $w56
    block $while_57_exit
      loop $while_57_lp
        local.get $w56
        ref.is_null
        i32.eqz
        if
          local.get $w56
          ref.cast (ref $ListCons_78)
          struct.get $ListCons_78 0
          local.set $i
          local.get $i
          struct.get $Todo_Item 2
          i32.eqz
          if
            local.get $w54
            i32.const 1
            i32.add
            local.set $w54
          end
          local.get $w56
          ref.cast (ref $ListCons_78)
          struct.get $ListCons_78 1
          local.set $w56
          br $while_57_lp
        else
          br $while_57_exit
        end
      end
    end
    local.get $w54
    local.set $open$0027
    ref.null $ListBase
    ref.null $ListBase
    i32.const 84
    i32.const 111
    i32.const 100
    i32.const 111
    array.new_fixed $WasmStr 4
    call $text_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    call $h2_ref79
    i32.const 103
    i32.const 114
    i32.const 105
    i32.const 100
    array.new_fixed $WasmStr 4
    call $class$0027_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    i32.const 87
    i32.const 104
    i32.const 97
    i32.const 116
    i32.const 32
    i32.const 110
    i32.const 101
    i32.const 101
    i32.const 100
    i32.const 115
    i32.const 32
    i32.const 100
    i32.const 111
    i32.const 105
    i32.const 110
    i32.const 103
    i32.const 63
    array.new_fixed $WasmStr 17
    call $placeholder_ref79
    local.get $m
    struct.get $Todo_Model 1
    call $value$0027_ref79
    ref.func $closure_51
    struct.new $ClosureType_123
    call $onInput_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    struct.new $ListCons_97
    struct.new $ListCons_97
    call $input_ref79
    i32.const 1
    struct.new $Todo_Msg#1
    call $onClick_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    i32.const 65
    i32.const 100
    i32.const 100
    array.new_fixed $WasmStr 3
    call $text_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    call $button_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    struct.new $ListCons_101
    call $div_ref79
    i32.const 115
    i32.const 116
    i32.const 121
    i32.const 108
    i32.const 101
    array.new_fixed $WasmStr 5
    i32.const 108
    i32.const 105
    i32.const 115
    i32.const 116
    i32.const 45
    i32.const 115
    i32.const 116
    i32.const 121
    i32.const 108
    i32.const 101
    i32.const 58
    i32.const 110
    i32.const 111
    i32.const 110
    i32.const 101
    i32.const 59
    i32.const 112
    i32.const 97
    i32.const 100
    i32.const 100
    i32.const 105
    i32.const 110
    i32.const 103
    i32.const 58
    i32.const 48
    array.new_fixed $WasmStr 25
    call $attr_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    local.get $m
    struct.get $Todo_Model 0
    local.set $list_2
    local.get $list_2
    local.set $w115
    ref.null $ListBase
    local.set $w116
    block $while_117_exit
      loop $while_117_lp
        local.get $w115
        ref.is_null
        i32.eqz
        if
          local.get $w115
          ref.cast (ref $ListCons_78)
          struct.get $ListCons_78 0
          local.set $i_1
          local.get $i_1
          call $viewItem
          local.get $w116
          struct.new $ListCons_101
          local.set $w116
          local.get $w115
          ref.cast (ref $ListCons_78)
          struct.get $ListCons_78 1
          local.set $w115
          br $while_117_lp
        else
          br $while_117_exit
        end
      end
    end
    local.get $w116
    local.set $w118
    ref.null $ListBase
    local.set $w119
    block $while_121_exit
      loop $while_121_lp
        local.get $w118
        ref.is_null
        i32.eqz
        if
          local.get $w118
          ref.cast (ref $ListCons_101)
          struct.get $ListCons_101 1
          local.set $w120
          local.get $w118
          ref.cast (ref $ListCons_101)
          local.get $w119
          struct.set $ListCons_101 1
          local.get $w118
          local.set $w119
          local.get $w120
          local.set $w118
          br $while_121_lp
        else
          br $while_121_exit
        end
      end
    end
    local.get $w119
    call $ul_ref79
    ref.null $ListBase
    ref.null $ListBase
    local.get $open$0027
    call $intToStr
    i32.const 32
    i32.const 111
    i32.const 112
    i32.const 101
    i32.const 110
    i32.const 32
    i32.const 183
    i32.const 32
    array.new_fixed $WasmStr 8
    call $strConcat
    local.get $m
    struct.get $Todo_Model 0
    local.set $w151
    i32.const 0
    local.set $w152
    block $while_153_exit
      loop $while_153_lp
        local.get $w151
        ref.is_null
        i32.eqz
        if
          local.get $w152
          i32.const 1
          i32.add
          local.set $w152
          local.get $w151
          ref.cast (ref $ListCons_78)
          struct.get $ListCons_78 1
          local.set $w151
          br $while_153_lp
        else
          br $while_153_exit
        end
      end
    end
    local.get $w152
    local.get $open$0027
    i32.sub
    call $intToStr
    call $strConcat
    i32.const 32
    i32.const 100
    i32.const 111
    i32.const 110
    i32.const 101
    i32.const 32
    i32.const 32
    array.new_fixed $WasmStr 7
    call $strConcat
    call $text_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    call $small_ref79
    i32.const 111
    i32.const 117
    i32.const 116
    i32.const 108
    i32.const 105
    i32.const 110
    i32.const 101
    array.new_fixed $WasmStr 7
    call $class$0027_ref79
    i32.const 115
    i32.const 116
    i32.const 121
    i32.const 108
    i32.const 101
    array.new_fixed $WasmStr 5
    i32.const 112
    i32.const 97
    i32.const 100
    i32.const 100
    i32.const 105
    i32.const 110
    i32.const 103
    i32.const 58
    i32.const 46
    i32.const 49
    i32.const 114
    i32.const 101
    i32.const 109
    i32.const 32
    i32.const 46
    i32.const 54
    i32.const 114
    i32.const 101
    i32.const 109
    array.new_fixed $WasmStr 19
    call $attr_ref79
    i32.const 4
    struct.new $Todo_Msg#4
    call $onClick_ref79
    ref.null $ListBase
    struct.new $ListCons_97
    struct.new $ListCons_97
    struct.new $ListCons_97
    i32.const 99
    i32.const 108
    i32.const 101
    i32.const 97
    i32.const 114
    i32.const 32
    i32.const 100
    i32.const 111
    i32.const 110
    i32.const 101
    array.new_fixed $WasmStr 10
    call $text_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    call $button_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    struct.new $ListCons_101
    call $p_ref79
    ref.null $ListBase
    struct.new $ListCons_101
    struct.new $ListCons_101
    struct.new $ListCons_101
    struct.new $ListCons_101
    return_call $article_ref79
  )
  (func $closure_60 (param $self (ref $AnyFn)) (param $_arg (ref $Todo_Model))
  )
  (func $simple_ref77~ref79 (param $init (ref $Todo_Model)) (param $update (ref $AnyFn)) (param $view (ref $AnyFn)) (param $noMsg (ref $Todo_Msg)) (result (ref $Browser_Elmish_Program`2<ref77~ref79>))
    local.get $init
    local.get $update
    local.get $view
    i32.const 0
    local.get $noMsg
    ref.func $closure_60
    struct.new $ClosureType_141
    struct.new $Browser_Elmish_Program`2<ref77~ref79>
  )
  (func $closure_65 (param $self (ref $AnyFn)) (param $m (ref $Todo_Model)) (result (ref $Todo_Model))
    (local $self_cast (ref $ClosureType_145))
    (local $msg (ref $Todo_Msg))
    local.get $self
    ref.cast (ref $ClosureType_145)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_145 1
    local.set $msg
    local.get $msg
    local.get $m
    return_call $update
  )
  (func $closure_64 (param $self (ref $AnyFn)) (param $msg (ref $Todo_Msg)) (result (ref $AnyFn))
    ref.func $closure_65
    local.get $msg
    struct.new $ClosureType_145
  )
  (func $closure_66 (param $self (ref $AnyFn)) (param $m_1 (ref $Todo_Model)) (result (ref $Browser_Elmish_Html`1<ref79>))
    local.get $m_1
    return_call $view
  )
  (func $closure_70 (param $self (ref $AnyFn)) (param $kind (ref $WasmStr)) (param $h (ref $AnyFn))
    (local $self_cast (ref $ClosureType_149))
    (local $handlers (ref $ResizeArray_27))
    (local $sb (ref $StringBuilder))
    (local $w155 i32)
    (local $w156 (ref $GcArray_26))
    (local $w157 i32)
    (local $w158 (ref $GcArray_26))
    (local $value (ref $StringBuilder))
    local.get $self
    ref.cast (ref $ClosureType_149)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_149 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_149 2
    local.set $sb
    local.get $handlers
    struct.get $ResizeArray_27 1
    local.set $w155
    local.get $handlers
    struct.get $ResizeArray_27 0
    ref.cast (ref $GcArray_26)
    local.set $w156
    local.get $w155
    local.get $w156
    array.len
    i32.ge_u
    if
      local.get $w156
      array.len
      i32.const 1
      i32.shl
      local.set $w157
      ref.null $AnyFn
      local.get $w157
      array.new $GcArray_26
      local.set $w158
      local.get $w158
      i32.const 0
      local.get $w156
      i32.const 0
      local.get $w155
      array.copy $GcArray_26 $GcArray_26
      local.get $handlers
      local.get $w158
      struct.set $ResizeArray_27 0
    end
    local.get $handlers
    struct.get $ResizeArray_27 0
    ref.cast (ref $GcArray_26)
    local.get $w155
    local.get $h
    array.set $GcArray_26
    local.get $handlers
    local.get $w155
    i32.const 1
    i32.add
    struct.set $ResizeArray_27 1
    local.get $sb
    i32.const 32
    i32.const 100
    i32.const 97
    i32.const 116
    i32.const 97
    i32.const 45
    i32.const 101
    i32.const 118
    i32.const 61
    i32.const 34
    array.new_fixed $WasmStr 10
    call $sbAppend
    local.get $handlers
    struct.get $ResizeArray_27 1
    i32.const 1
    i32.sub
    call $intToStr
    call $sbAppend
    i32.const 34
    i32.const 32
    i32.const 100
    i32.const 97
    i32.const 116
    i32.const 97
    i32.const 45
    i32.const 111
    i32.const 110
    i32.const 61
    i32.const 34
    array.new_fixed $WasmStr 11
    call $sbAppend
    local.get $kind
    call $sbAppend
    i32.const 34
    array.new_fixed $WasmStr 1
    call $sbAppend
    local.set $value
  )
  (func $closure_71 (param $self (ref $AnyFn)) (param $_arg (ref $WasmStr)) (result (ref $Todo_Msg))
    (local $self_cast (ref $ClosureType_150))
    local.get $self
    ref.cast (ref $ClosureType_150)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_150 1
  )
  (func $closure_74 (param $self (ref $AnyFn)) (param $xy (ref $WasmStr)) (result (ref $Todo_Msg))
    (local $self_cast (ref $ClosureType_155))
    (local $f_1 (ref $AnyFn))
    (local $parts (ref $GcArray_38))
    (local $ap_arg_75_0 i32)
    (local $ap_arg_75_1 i32)
    (local $lo_tail_5 (ref $ClosureBase_152))
    (local $lo_tail_7 (ref $ClosureBase_154))
    (local $lo_clo_6 (ref $ClosureBase_22))
    local.get $self
    ref.cast (ref $ClosureType_155)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_155 1
    local.set $f_1
    local.get $xy
    i32.const 44
    array.new_fixed $WasmStr 1
    call $strSplit
    local.set $parts
    local.get $parts
    i32.const 0
    array.get $GcArray_38
    ref.cast (ref $WasmStr)
    call $parseInt
    local.set $ap_arg_75_0
    local.get $parts
    i32.const 1
    array.get $GcArray_38
    ref.cast (ref $WasmStr)
    call $parseInt
    local.set $ap_arg_75_1
    local.get $f_1
    ref.test (ref $ClosureBase_152)
    if (result (ref $Todo_Msg))
      local.get $f_1
      ref.cast (ref $ClosureBase_152)
      local.set $lo_tail_5
      local.get $lo_tail_5
      local.get $ap_arg_75_0
      local.get $ap_arg_75_1
      local.get $lo_tail_5
      struct.get $ClosureBase_152 0
      return_call_ref $FuncType_151
    else
      local.get $f_1
      ref.cast (ref $ClosureBase_22)
      local.set $lo_clo_6
      local.get $lo_clo_6
      local.get $ap_arg_75_0
      local.get $lo_clo_6
      struct.get $ClosureBase_22 0
      call_ref $FuncType_21
      ref.cast (ref $ClosureBase_154)
      local.set $lo_tail_7
      local.get $lo_tail_7
      local.get $ap_arg_75_1
      local.get $lo_tail_7
      struct.get $ClosureBase_154 0
      return_call_ref $FuncType_153
    end
  )
  (func $renderAttr_ref79 (param $handlers (ref $ResizeArray_27)) (param $sb (ref $StringBuilder)) (param $a (ref $Browser_Elmish_Attr`1<ref79>))
    (local $register (ref $ClosureType_149))
    (local $msg (ref $Todo_Msg))
    (local $ap_arg_72_0 (ref $WasmStr))
    (local $ap_arg_72_1 (ref $ClosureType_150))
    (local $lo_clo_8 (ref $ClosureBase_29))
    (local $lo_clo_10 (ref $ClosureBase_37))
    (local $lo_clo_9 (ref $ClosureBase_35))
    (local $f (ref $AnyFn))
    (local $ap_arg_73_0 (ref $WasmStr))
    (local $lo_clo_11 (ref $ClosureBase_29))
    (local $lo_clo_13 (ref $ClosureBase_37))
    (local $lo_clo_12 (ref $ClosureBase_35))
    (local $f_1 (ref $AnyFn))
    (local $ap_arg_76_0 (ref $WasmStr))
    (local $ap_arg_76_1 (ref $ClosureType_155))
    (local $lo_clo_14 (ref $ClosureBase_29))
    (local $lo_clo_16 (ref $ClosureBase_37))
    (local $lo_clo_15 (ref $ClosureBase_35))
    (local $v (ref $WasmStr))
    (local $k (ref $WasmStr))
    (local $value_1 (ref $StringBuilder))
    ref.func $closure_70
    local.get $handlers
    local.get $sb
    struct.new $ClosureType_149
    local.set $register
    local.get $a
    struct.get $Browser_Elmish_Attr`1<ref79> 0
    i32.const 1
    i32.eq
    if
      local.get $a
      ref.cast (ref $Browser_Elmish_Attr`1<ref79>#1)
      struct.get $Browser_Elmish_Attr`1<ref79>#1 1
      local.set $msg
      i32.const 99
      i32.const 108
      i32.const 105
      i32.const 99
      i32.const 107
      array.new_fixed $WasmStr 5
      local.set $ap_arg_72_0
      ref.func $closure_71
      local.get $msg
      struct.new $ClosureType_150
      local.set $ap_arg_72_1
      local.get $register
      ref.test (ref $ClosureBase_29)
      if
        local.get $register
        ref.cast (ref $ClosureBase_29)
        local.set $lo_clo_8
        local.get $lo_clo_8
        local.get $ap_arg_72_0
        local.get $ap_arg_72_1
        local.get $lo_clo_8
        struct.get $ClosureBase_29 0
        call_ref $FuncType_28
      else
        local.get $register
        ref.cast (ref $ClosureBase_35)
        local.set $lo_clo_9
        local.get $lo_clo_9
        local.get $ap_arg_72_0
        local.get $lo_clo_9
        struct.get $ClosureBase_35 0
        call_ref $FuncType_34
        ref.cast (ref $ClosureBase_37)
        local.set $lo_clo_10
        local.get $lo_clo_10
        local.get $ap_arg_72_1
        local.get $lo_clo_10
        struct.get $ClosureBase_37 0
        call_ref $FuncType_36
      end
    else
      local.get $a
      struct.get $Browser_Elmish_Attr`1<ref79> 0
      i32.const 2
      i32.eq
      if
        local.get $a
        ref.cast (ref $Browser_Elmish_Attr`1<ref79>#2)
        struct.get $Browser_Elmish_Attr`1<ref79>#2 1
        local.set $f
        i32.const 105
        i32.const 110
        i32.const 112
        i32.const 117
        i32.const 116
        array.new_fixed $WasmStr 5
        local.set $ap_arg_73_0
        local.get $register
        ref.test (ref $ClosureBase_29)
        if
          local.get $register
          ref.cast (ref $ClosureBase_29)
          local.set $lo_clo_11
          local.get $lo_clo_11
          local.get $ap_arg_73_0
          local.get $f
          local.get $lo_clo_11
          struct.get $ClosureBase_29 0
          call_ref $FuncType_28
        else
          local.get $register
          ref.cast (ref $ClosureBase_35)
          local.set $lo_clo_12
          local.get $lo_clo_12
          local.get $ap_arg_73_0
          local.get $lo_clo_12
          struct.get $ClosureBase_35 0
          call_ref $FuncType_34
          ref.cast (ref $ClosureBase_37)
          local.set $lo_clo_13
          local.get $lo_clo_13
          local.get $f
          local.get $lo_clo_13
          struct.get $ClosureBase_37 0
          call_ref $FuncType_36
        end
      else
        local.get $a
        struct.get $Browser_Elmish_Attr`1<ref79> 0
        i32.const 3
        i32.eq
        if
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<ref79>#3)
          struct.get $Browser_Elmish_Attr`1<ref79>#3 1
          local.set $f_1
          i32.const 99
          i32.const 108
          i32.const 105
          i32.const 99
          i32.const 107
          array.new_fixed $WasmStr 5
          local.set $ap_arg_76_0
          ref.func $closure_74
          local.get $f_1
          struct.new $ClosureType_155
          local.set $ap_arg_76_1
          local.get $register
          ref.test (ref $ClosureBase_29)
          if
            local.get $register
            ref.cast (ref $ClosureBase_29)
            local.set $lo_clo_14
            local.get $lo_clo_14
            local.get $ap_arg_76_0
            local.get $ap_arg_76_1
            local.get $lo_clo_14
            struct.get $ClosureBase_29 0
            call_ref $FuncType_28
          else
            local.get $register
            ref.cast (ref $ClosureBase_35)
            local.set $lo_clo_15
            local.get $lo_clo_15
            local.get $ap_arg_76_0
            local.get $lo_clo_15
            struct.get $ClosureBase_35 0
            call_ref $FuncType_34
            ref.cast (ref $ClosureBase_37)
            local.set $lo_clo_16
            local.get $lo_clo_16
            local.get $ap_arg_76_1
            local.get $lo_clo_16
            struct.get $ClosureBase_37 0
            call_ref $FuncType_36
          end
        else
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<ref79>#0)
          struct.get $Browser_Elmish_Attr`1<ref79>#0 2
          local.set $v
          local.get $a
          ref.cast (ref $Browser_Elmish_Attr`1<ref79>#0)
          struct.get $Browser_Elmish_Attr`1<ref79>#0 1
          local.set $k
          local.get $sb
          i32.const 32
          array.new_fixed $WasmStr 1
          call $sbAppend
          local.get $k
          call $sbAppend
          i32.const 61
          i32.const 34
          array.new_fixed $WasmStr 2
          call $sbAppend
          local.get $v
          call $escape
          call $sbAppend
          i32.const 34
          array.new_fixed $WasmStr 1
          call $sbAppend
          local.set $value_1
        end
      end
    end
  )
  (func $renderTo_ref79 (param $handlers (ref $ResizeArray_27)) (param $sb (ref $StringBuilder)) (param $html (ref $Browser_Elmish_Html`1<ref79>))
    (local $tag (ref $WasmStr))
    (local $children (ref null $ListBase))
    (local $attrs (ref null $ListBase))
    (local $value_1 (ref $StringBuilder))
    (local $w160 (ref null $ListBase))
    (local $a (ref $Browser_Elmish_Attr`1<ref79>))
    (local $value_2 (ref $StringBuilder))
    (local $w163 (ref null $ListBase))
    (local $html_1 (ref $Browser_Elmish_Html`1<ref79>))
    (local $value_3 (ref $StringBuilder))
    (local $s (ref $WasmStr))
    (local $value (ref $StringBuilder))
    local.get $html
    struct.get $Browser_Elmish_Html`1<ref79> 0
    i32.const 1
    i32.eq
    if
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<ref79>#1)
      struct.get $Browser_Elmish_Html`1<ref79>#1 1
      local.set $tag
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<ref79>#1)
      struct.get $Browser_Elmish_Html`1<ref79>#1 3
      local.set $children
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<ref79>#1)
      struct.get $Browser_Elmish_Html`1<ref79>#1 2
      local.set $attrs
      local.get $sb
      i32.const 60
      array.new_fixed $WasmStr 1
      call $sbAppend
      local.get $tag
      call $sbAppend
      local.set $value_1
      local.get $attrs
      local.set $w160
      block $while_161_exit
        loop $while_161_lp
          local.get $w160
          ref.is_null
          i32.eqz
          if
            local.get $w160
            ref.cast (ref $ListCons_97)
            struct.get $ListCons_97 0
            local.set $a
            local.get $handlers
            local.get $sb
            local.get $a
            call $renderAttr_ref79
            local.get $w160
            ref.cast (ref $ListCons_97)
            struct.get $ListCons_97 1
            local.set $w160
            br $while_161_lp
          else
            br $while_161_exit
          end
        end
      end
      local.get $sb
      i32.const 62
      array.new_fixed $WasmStr 1
      call $sbAppend
      local.set $value_2
      local.get $children
      local.set $w163
      block $while_164_exit
        loop $while_164_lp
          local.get $w163
          ref.is_null
          i32.eqz
          if
            local.get $w163
            ref.cast (ref $ListCons_101)
            struct.get $ListCons_101 0
            local.set $html_1
            local.get $handlers
            local.get $sb
            local.get $html_1
            call $renderTo_ref79
            local.get $w163
            ref.cast (ref $ListCons_101)
            struct.get $ListCons_101 1
            local.set $w163
            br $while_164_lp
          else
            br $while_164_exit
          end
        end
      end
      local.get $sb
      i32.const 60
      i32.const 47
      array.new_fixed $WasmStr 2
      call $sbAppend
      local.get $tag
      call $sbAppend
      i32.const 62
      array.new_fixed $WasmStr 1
      call $sbAppend
      local.set $value_3
    else
      local.get $html
      ref.cast (ref $Browser_Elmish_Html`1<ref79>#0)
      struct.get $Browser_Elmish_Html`1<ref79>#0 1
      local.set $s
      local.get $sb
      local.get $s
      call $escape
      call $sbAppend
      local.set $value
    end
  )
  (func $closure_79 (param $self (ref $AnyFn)) (param $text (ref $WasmStr))
    (local $self_cast (ref $ClosureType_164))
    (local $handlers (ref $ResizeArray_27))
    (local $id i32)
    (local $model (ref $RefCell_148))
    (local $p (ref $Browser_Elmish_Program`2<ref77~ref79>))
    (local $render (ref $AnyFn))
    (local $ap_clo_80 (ref $AnyFn))
    (local $ap_arg_80_0 (ref $Todo_Msg))
    (local $lo_clo_17 (ref $ClosureBase_103))
    (local $ap_arg_80_1 (ref $Todo_Model))
    (local $lo_clo_18 (ref $ClosureBase_163))
    (local $lo_clo_20 (ref $ClosureBase_128))
    (local $lo_clo_19 (ref $ClosureBase_131))
    (local $lo_clo_21 (ref $ClosureBase_5))
    local.get $self
    ref.cast (ref $ClosureType_164)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_164 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_164 2
    local.set $id
    local.get $self_cast
    struct.get $ClosureType_164 3
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_164 4
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_164 5
    local.set $render
    local.get $model
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref77~ref79> 1
    local.set $ap_clo_80
    local.get $handlers
    struct.get $ResizeArray_27 0
    ref.cast (ref $GcArray_26)
    local.get $id
    array.get $GcArray_26
    ref.cast (ref $AnyFn)
    ref.cast (ref $ClosureBase_103)
    local.set $lo_clo_17
    local.get $lo_clo_17
    local.get $text
    local.get $lo_clo_17
    struct.get $ClosureBase_103 0
    call_ref $FuncType_102
    local.set $ap_arg_80_0
    local.get $model
    struct.get $RefCell_148 0
    local.set $ap_arg_80_1
    local.get $ap_clo_80
    ref.test (ref $ClosureBase_163)
    if (result (ref $Todo_Model))
      local.get $ap_clo_80
      ref.cast (ref $ClosureBase_163)
      local.set $lo_clo_18
      local.get $lo_clo_18
      local.get $ap_arg_80_0
      local.get $ap_arg_80_1
      local.get $lo_clo_18
      struct.get $ClosureBase_163 0
      call_ref $FuncType_162
    else
      local.get $ap_clo_80
      ref.cast (ref $ClosureBase_131)
      local.set $lo_clo_19
      local.get $lo_clo_19
      local.get $ap_arg_80_0
      local.get $lo_clo_19
      struct.get $ClosureBase_131 0
      call_ref $FuncType_130
      ref.cast (ref $ClosureBase_128)
      local.set $lo_clo_20
      local.get $lo_clo_20
      local.get $ap_arg_80_1
      local.get $lo_clo_20
      struct.get $ClosureBase_128 0
      call_ref $FuncType_127
    end
    struct.set $RefCell_148 0
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_21
    local.get $lo_clo_21
    local.get $lo_clo_21
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
  )
  (func $closure_78 (param $self (ref $AnyFn)) (param $id i32) (result (ref $AnyFn))
    (local $self_cast (ref $ClosureType_165))
    (local $handlers (ref $ResizeArray_27))
    (local $model (ref $RefCell_148))
    (local $p (ref $Browser_Elmish_Program`2<ref77~ref79>))
    (local $render (ref $AnyFn))
    local.get $self
    ref.cast (ref $ClosureType_165)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_165 1
    local.set $handlers
    local.get $self_cast
    struct.get $ClosureType_165 2
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_165 3
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_165 4
    local.set $render
    ref.func $closure_79
    local.get $handlers
    local.get $id
    local.get $model
    local.get $p
    local.get $render
    struct.new $ClosureType_164
  )
  (func $letrec_render_68 (param $self (ref $AnyFn))
    (local $self_cast (ref $ClosureType_166))
    (local $model (ref $RefCell_148))
    (local $p (ref $Browser_Elmish_Program`2<ref77~ref79>))
    (local $handlers (ref $ResizeArray_27))
    (local $sb (ref $StringBuilder))
    (local $lo_clo_22 (ref $ClosureBase_134))
    (local $lo_clo_23 (ref $ClosureBase_140))
    local.get $self
    ref.cast (ref $ClosureType_166)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_166 1
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_166 2
    local.set $p
    ref.null $AnyFn
    i32.const 4
    array.new $GcArray_26
    i32.const 0
    struct.new $ResizeArray_27
    local.set $handlers
    i32.const 16
    call $sbCreate
    local.set $sb
    local.get $handlers
    local.get $sb
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref77~ref79> 2
    ref.cast (ref $ClosureBase_134)
    local.set $lo_clo_22
    local.get $lo_clo_22
    local.get $model
    struct.get $RefCell_148 0
    local.get $lo_clo_22
    struct.get $ClosureBase_134 0
    call_ref $FuncType_133
    call $renderTo_ref79
    i32.const 0
    local.get $sb
    call $sbToString
    call $send
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref77~ref79> 5
    ref.cast (ref $ClosureBase_140)
    local.set $lo_clo_23
    local.get $lo_clo_23
    local.get $model
    struct.get $RefCell_148 0
    local.get $lo_clo_23
    struct.get $ClosureBase_140 0
    call_ref $FuncType_139
    ref.func $closure_78
    local.get $handlers
    local.get $model
    local.get $p
    local.get $self
    struct.new $ClosureType_165
    global.set $handlerSlot
  )
  (func $closure_81 (param $self (ref $AnyFn))
    (local $self_cast (ref $ClosureType_167))
    (local $model (ref $RefCell_148))
    (local $p (ref $Browser_Elmish_Program`2<ref77~ref79>))
    (local $render (ref $AnyFn))
    (local $ap_clo_82 (ref $AnyFn))
    (local $ap_arg_82_0 (ref $Todo_Msg))
    (local $ap_arg_82_1 (ref $Todo_Model))
    (local $lo_clo_24 (ref $ClosureBase_163))
    (local $lo_clo_26 (ref $ClosureBase_128))
    (local $lo_clo_25 (ref $ClosureBase_131))
    (local $lo_clo_27 (ref $ClosureBase_5))
    local.get $self
    ref.cast (ref $ClosureType_167)
    local.set $self_cast
    local.get $self_cast
    struct.get $ClosureType_167 1
    local.set $model
    local.get $self_cast
    struct.get $ClosureType_167 2
    local.set $p
    local.get $self_cast
    struct.get $ClosureType_167 3
    local.set $render
    local.get $model
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref77~ref79> 1
    local.set $ap_clo_82
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref77~ref79> 4
    local.set $ap_arg_82_0
    local.get $model
    struct.get $RefCell_148 0
    local.set $ap_arg_82_1
    local.get $ap_clo_82
    ref.test (ref $ClosureBase_163)
    if (result (ref $Todo_Model))
      local.get $ap_clo_82
      ref.cast (ref $ClosureBase_163)
      local.set $lo_clo_24
      local.get $lo_clo_24
      local.get $ap_arg_82_0
      local.get $ap_arg_82_1
      local.get $lo_clo_24
      struct.get $ClosureBase_163 0
      call_ref $FuncType_162
    else
      local.get $ap_clo_82
      ref.cast (ref $ClosureBase_131)
      local.set $lo_clo_25
      local.get $lo_clo_25
      local.get $ap_arg_82_0
      local.get $lo_clo_25
      struct.get $ClosureBase_131 0
      call_ref $FuncType_130
      ref.cast (ref $ClosureBase_128)
      local.set $lo_clo_26
      local.get $lo_clo_26
      local.get $ap_arg_82_1
      local.get $lo_clo_26
      struct.get $ClosureBase_128 0
      call_ref $FuncType_127
    end
    struct.set $RefCell_148 0
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_27
    local.get $lo_clo_27
    local.get $lo_clo_27
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
  )
  (func $run_ref77~ref79 (param $p (ref $Browser_Elmish_Program`2<ref77~ref79>))
    (local $model (ref $RefCell_148))
    (local $render (ref $ClosureType_166))
    (local $lo_clo_28 (ref $ClosureBase_5))
    (local $value i32)
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref77~ref79> 0
    struct.new $RefCell_148
    local.set $model
    ref.func $letrec_render_68
    local.get $model
    local.get $p
    struct.new $ClosureType_166
    local.set $render
    local.get $render
    ref.cast (ref $ClosureBase_5)
    local.set $lo_clo_28
    local.get $lo_clo_28
    local.get $lo_clo_28
    struct.get $ClosureBase_5 0
    call_ref $FuncType_4
    local.get $p
    struct.get $Browser_Elmish_Program`2<ref77~ref79> 3
    i32.const 0
    i32.gt_s
    if
      local.get $p
      struct.get $Browser_Elmish_Program`2<ref77~ref79> 3
      ref.func $closure_81
      local.get $model
      local.get $p
      local.get $render
      struct.new $ClosureType_167
      call $every
      local.set $value
    end
  )
  (func $main ;; exported as "main"
    call $init
    ref.func $closure_64
    struct.new $ClosureType_146
    ref.func $closure_66
    struct.new $ClosureType_147
    i32.const 1
    struct.new $Todo_Msg#1
    call $simple_ref77~ref79
    call $run_ref77~ref79
  )
  (func $__init
    call $tickSlot$init
    global.set $tickSlot
    call $inbox$init
    global.set $inbox
    call $handlerSlot$init
    global.set $handlerSlot
  )
  ;; ── Elem declare (func refs) ────────────────────────
  (elem declare func $closure_1 $closure_2 $closure_3 $closure_51 $closure_60 $closure_64 $closure_65 $closure_66 $closure_70 $closure_71 $closure_74 $closure_78 $closure_79 $closure_81 $letrec_render_68)
  (start $__init)
  ;; ── Exports ────────────────────────────────────────
  (export "tick" (func $tick))
  (export "every" (func $every))
  (export "send" (func $send))
  (export "inboxClear" (func $inboxClear))
  (export "inboxPut" (func $inboxPut))
  (export "inboxText" (func $inboxText))
  (export "escape" (func $escape))
  (export "dispatch" (func $dispatch))
  (export "init" (func $init))
  (export "update" (func $update))
  (export "viewItem" (func $viewItem))
  (export "view" (func $view))
  (export "main" (func $main))
  ;; ── Globals ─────────────────────────────────────────
  (global $fsharp_exn_carrier (mut anyref)ref.null any
)
  (global $tickSlot (mut (ref null $AnyFn))ref.null $AnyFn
)
  (global $inbox (mut (ref null $WasmStr))ref.null $WasmStr
)
  (global $handlerSlot (mut (ref null $AnyFn))ref.null $AnyFn
)
)

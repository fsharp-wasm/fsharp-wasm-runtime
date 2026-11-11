(module
  ;; ── Types ───────────────────────────────────────────
  (type $AnyFn (sub (struct)))
  (type $WasmStr (array (mut i32)))
  (type $ListBase (sub (struct)))
  (type $StringBuilder (sub (struct (field (mut (ref $WasmStr))) (field (mut i32)) (field (mut i32)))))
  (type $GcArray_4 (array (mut i32)))
  ;; ── Imports ────────────────────────────────────────
  (import "env" "consolePrint" (func $consolePrint (param (ref $WasmStr))))
  ;; ── Tags (exception handling) ──────────────────────
  (tag $fsharp_exn)
  ;; ── Functions ──────────────────────────────────────
  (func $mandelbrot (param $n i32) (result i32) ;; exported as "mandelbrot"
    (local $inside i32)
    (local $py i32)
    (local $limit i32)
    (local $px i32)
    (local $limit_1 i32)
    (local $cr f64)
    (local $ci f64)
    (local $zr f64)
    (local $zi f64)
    (local $i i32)
    (local $t f64)
    i32.const 0
    local.set $inside
    i32.const 0
    local.set $py
    local.get $n
    i32.const 1
    i32.sub
    local.set $limit
    loop $for
      local.get $py
      local.get $limit
      i32.le_s
      if
        i32.const 0
        local.set $px
        local.get $n
        i32.const 1
        i32.sub
        local.set $limit_1
        loop $for
          local.get $px
          local.get $limit_1
          i32.le_s
          if
            f64.const 3.5
            local.get $px
            f64.convert_i32_s
            f64.mul
            local.get $n
            f64.convert_i32_s
            f64.div
            f64.const 2.5
            f64.sub
            local.set $cr
            f64.const 2
            local.get $py
            f64.convert_i32_s
            f64.mul
            local.get $n
            f64.convert_i32_s
            f64.div
            f64.const 1
            f64.sub
            local.set $ci
            f64.const 0
            local.set $zr
            f64.const 0
            local.set $zi
            i32.const 0
            local.set $i
            loop $while
              local.get $i
              i32.const 200
              i32.lt_s
              if (result i32)
                local.get $zr
                local.get $zr
                f64.mul
                local.get $zi
                local.get $zi
                f64.mul
                f64.add
                f64.const 4
                f64.le
              else
                i32.const 0
              end
              if
                local.get $zr
                local.get $zr
                f64.mul
                local.get $zi
                local.get $zi
                f64.mul
                f64.sub
                local.get $cr
                f64.add
                local.set $t
                f64.const 2
                local.get $zr
                f64.mul
                local.get $zi
                f64.mul
                local.get $ci
                f64.add
                local.set $zi
                local.get $t
                local.set $zr
                local.get $i
                i32.const 1
                i32.add
                local.set $i
                br $while
              end
            end
            local.get $i
            i32.const 200
            i32.eq
            if
              local.get $inside
              i32.const 1
              i32.add
              local.set $inside
            end
            local.get $px
            i32.const 1
            i32.add
            local.set $px
            br $for
          end
        end
        local.get $py
        i32.const 1
        i32.add
        local.set $py
        br $for
      end
    end
    local.get $inside
  )
  (func $primes (param $n i32) (result i32) ;; exported as "primes"
    (local $composite (ref $GcArray_4))
    (local $count i32)
    (local $i i32)
    (local $j i32)
    i32.const 0
    local.get $n
    i32.const 1
    i32.add
    array.new $GcArray_4
    local.set $composite
    i32.const 0
    local.set $count
    i32.const 2
    local.set $i
    loop $for
      local.get $i
      local.get $n
      i32.le_s
      if
        local.get $composite
        local.get $i
        array.get $GcArray_4
        i32.eqz
        if
          local.get $count
          i32.const 1
          i32.add
          local.set $count
          local.get $i
          i32.const 1
          i32.shl
          local.set $j
          loop $while
            local.get $j
            local.get $n
            i32.le_s
            if
              local.get $composite
              local.get $j
              i32.const 1
              array.set $GcArray_4
              local.get $j
              local.get $i
              i32.add
              local.set $j
              br $while
            end
          end
        end
        local.get $i
        i32.const 1
        i32.add
        local.set $i
        br $for
      end
    end
    local.get $count
  )
  (func $collatz (param $n i32) (result i32) ;; exported as "collatz"
    (local $best i32)
    (local $start i32)
    (local $x i64)
    (local $steps i32)
    i32.const 0
    local.set $best
    i32.const 1
    local.set $start
    loop $for
      local.get $start
      local.get $n
      i32.le_s
      if
        local.get $start
        i64.extend_i32_s
        local.set $x
        i32.const 0
        local.set $steps
        loop $while
          local.get $x
          i64.const 1
          i64.eq
          i32.eqz
          if
            local.get $x
            i64.const 2
            i64.rem_s
            i64.const 0
            i64.eq
            if (result i64)
              local.get $x
              i64.const 2
              i64.div_s
            else
              i64.const 3
              local.get $x
              i64.mul
              i64.const 1
              i64.add
            end
            local.set $x
            local.get $steps
            i32.const 1
            i32.add
            local.set $steps
            br $while
          end
        end
        local.get $steps
        local.get $best
        i32.gt_s
        if
          local.get $steps
          local.set $best
        end
        local.get $start
        i32.const 1
        i32.add
        local.set $start
        br $for
      end
    end
    local.get $best
  )
  (func $pipeline (param $n i32) (result i32) ;; exported as "pipeline"
    (local $w1 i32)
    (local $w2 i64)
    (local $w3 i64)
    (local $w4 i64)
    (local $v i32)
    (local $v_1 i32)
    i32.const 0
    local.set $w1
    i32.const 1
    i64.extend_i32_s
    local.set $w2
    i32.const 1
    i64.extend_i32_s
    local.set $w3
    local.get $n
    i64.extend_i32_s
    local.set $w4
    local.get $w3
    i64.const 0
    i64.eq
    if
      throw $fsharp_exn
    end
    block $while_5_exit
      loop $while_5_lp
        local.get $w2
        local.get $w4
        i64.le_s
        if
          local.get $w2
          i32.wrap_i64
          local.set $v
          local.get $v
          i32.const 3
          i32.mul
          local.set $v_1
          local.get $v_1
          i32.const 2
          i32.rem_s
          i32.const 0
          i32.eq
          if
            local.get $w1
            local.get $v_1
            i32.const 1000
            i32.rem_s
            i32.add
            local.set $w1
          end
          local.get $w2
          local.get $w3
          i64.add
          local.set $w2
          br $while_5_lp
        else
          br $while_5_exit
        end
      end
    end
    local.get $w1
  )
  ;; ── Exports ────────────────────────────────────────
  (export "mandelbrot" (func $mandelbrot))
  (export "primes" (func $primes))
  (export "collatz" (func $collatz))
  (export "pipeline" (func $pipeline))
  ;; ── Globals ─────────────────────────────────────────
  (global $fsharp_exn_carrier (mut anyref)ref.null any
)
)
